import { useState, useEffect, useRef, useCallback } from 'react';

export interface DeviceCompassState {
  isSupported: boolean;
  isTracking: boolean;
  heading: number | null;
  accuracy: number | null;
  error: string | null;
  startTracking: () => Promise<boolean>;
  stopTracking: () => void;
  toggleTracking: () => void;
}

/**
 * Custom hook to connect to real hardware magnetic compass sensors
 * Supports iOS (Safari / Chrome via webkitCompassHeading) and Android (deviceorientationabsolute / alpha)
 */
export function useDeviceCompass(onHeadingChange?: (heading: number) => void): DeviceCompassState {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [heading, setHeading] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Keep a stable ref to onHeadingChange to avoid listener teardown on parent re-renders
  const onHeadingChangeRef = useRef(onHeadingChange);
  useEffect(() => {
    onHeadingChangeRef.current = onHeadingChange;
  }, [onHeadingChange]);

  const smoothedHeadingRef = useRef<number | null>(null);
  const isTrackingRef = useRef<boolean>(false);
  isTrackingRef.current = isTracking;

  // Check support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setIsSupported(true);
    }
  }, []);

  // Stable listener callback that NEVER causes listener re-binding
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (!isTrackingRef.current) return;

    let rawHeading: number | null = null;

    // 1. iOS Safari / iOS WebKit (webkitCompassHeading: 0° = North, 90° = East, 180° = South, 270° = West)
    if (typeof (e as any).webkitCompassHeading === 'number') {
      rawHeading = (e as any).webkitCompassHeading;
      if (typeof (e as any).webkitCompassAccuracy === 'number') {
        setAccuracy((e as any).webkitCompassAccuracy);
      }
    }
    // 2. Android Chrome / Standard absolute orientation (e.alpha)
    else if (e.alpha !== null && e.alpha !== undefined) {
      // In Android absolute coordinates: heading = 360 - alpha
      let alphaHeading = (360 - e.alpha) % 360;

      // Adjust for screen orientation angle if device is rotated
      let orientationAngle = 0;
      if (typeof window !== 'undefined') {
        if (window.screen?.orientation?.angle !== undefined) {
          orientationAngle = window.screen.orientation.angle;
        } else if (typeof (window as any).orientation === 'number') {
          orientationAngle = (window as any).orientation;
        }
      }

      rawHeading = (alphaHeading + orientationAngle + 360) % 360;
    }

    if (rawHeading !== null && !isNaN(rawHeading)) {
      // Normalize to 0 - 359.9
      let normalized = (rawHeading % 360 + 360) % 360;

      // Smooth jitter using circular angular difference
      if (smoothedHeadingRef.current === null) {
        smoothedHeadingRef.current = normalized;
      } else {
        let diff = normalized - smoothedHeadingRef.current;
        // Circular wrap-around
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        // Smooth responsive filter (0.35 weight)
        smoothedHeadingRef.current = (smoothedHeadingRef.current + diff * 0.35 + 360) % 360;
      }

      const finalRounded = Math.round(smoothedHeadingRef.current * 10) / 10;
      const finalInt = Math.round(finalRounded);
      setHeading(finalRounded);
      onHeadingChangeRef.current?.(finalInt);
    }
  }, []);

  // Manage listeners strictly via isTracking effect
  useEffect(() => {
    if (!isTracking || typeof window === 'undefined') return;

    // Register both absolute and standard orientation events
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isTracking, handleOrientation]);

  const startTracking = useCallback(async (): Promise<boolean> => {
    setError(null);

    // iOS 13+ requires explicit permission request via user interaction
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as any)?.requestPermission === 'function'
    ) {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== 'granted') {
          setError('Vui lòng cấp quyền Cảm biến Chuyển động (Motion & Orientation) trên Safari iPhone để la bàn tự xoay.');
          setIsTracking(false);
          isTrackingRef.current = false;
          return false;
        }
      } catch (err: any) {
        console.warn('DeviceOrientation permission request error:', err);
        setError('Không thể kích hoạt quyền la bàn trên thiết bị. Hãy thử mở lại trực tiếp trên trình duyệt Safari.');
        setIsTracking(false);
        isTrackingRef.current = false;
        return false;
      }
    }

    isTrackingRef.current = true;
    setIsTracking(true);
    return true;
  }, []);

  const stopTracking = useCallback(() => {
    isTrackingRef.current = false;
    setIsTracking(false);
  }, []);

  const toggleTracking = useCallback(() => {
    if (isTrackingRef.current) {
      stopTracking();
    } else {
      startTracking();
    }
  }, [startTracking, stopTracking]);

  return {
    isSupported,
    isTracking,
    heading,
    accuracy,
    error,
    startTracking,
    stopTracking,
    toggleTracking,
  };
}
