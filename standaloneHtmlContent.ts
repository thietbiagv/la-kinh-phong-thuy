// Function to get the standalone HTML content directly in memory
export async function getStandaloneHtmlString(): Promise<string> {
  try {
    const res = await fetch('/standalone-lakinh-huyenkhong.html');
    if (res.ok) {
      return await res.text();
    }
  } catch (e) {
    // fallback
  }

  // Self-contained generator
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>La Kinh 24 Sơn Hướng & Tinh Bàn Huyền Không Phi Tinh (Đơn Lập)</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-stone-900 text-stone-100 p-4">
  <h1 class="text-xl font-bold text-amber-400">La Kinh 24 Sơn Hướng & Huyền Không Phi Tinh</h1>
  <p>Vui lòng mở file standalone-lakinh-huyenkhong.html đầy đủ trong thư mục dự án.</p>
</body>
</html>`;
}
