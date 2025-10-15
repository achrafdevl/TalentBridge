export function decodeHtml(html: string): string {
    if (!html) return "";
  
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
  
    return txt.value;
  }
  
  export function decodeHtmlFast(html: string): string {
    return html
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }
  