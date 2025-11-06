/**
 * 下载文本内容为文件
 * @param content - 要下载的文本内容
 * @param filename - 下载的文件名
 * @param mimeType - MIME 类型，默认为 'text/plain'
 */
export function download(content: string, filename: string, mimeType: string = "text/plain"): void {
  // 创建 Blob 对象
  const blob = new Blob([content], { type: mimeType });

  // 创建对象 URL
  const url = URL.createObjectURL(blob);

  // 创建临时的 a 标签用于下载
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // 将 a 标签添加到 DOM，触发点击，然后移除
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // 清理对象 URL
  URL.revokeObjectURL(url);
}

/**
 * 下载 JSON 数据为文件
 * @param data - 要下载的数据对象
 * @param filename - 下载的文件名
 */
export function downloadJSON(data: any, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  download(jsonString, filename, "application/json");
}

/**
 * 下载 CSV 数据为文件
 * @param csvContent - CSV 格式的字符串内容
 * @param filename - 下载的文件名
 */
export function downloadCSV(csvContent: string, filename: string): void {
  download(csvContent, filename, "text/csv");
}
