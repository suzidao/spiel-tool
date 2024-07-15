/** @format */

const PARENTPAGECOUNT = 4;

export async function GET() {
  const previewItems: Entry[] = [];
  for (let i = 1; i <= PARENTPAGECOUNT; i++) {
    const response = await fetch(
      `https://api.geekdo.com/api/geekpreviewparentitems?nosession=1&pageid=${i}&previewid=68`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        cache: "no-store",
      }
    );
    const batchItems = await response.json();
    for (let i = 0; i < batchItems.length; i++) {
      previewItems.push(batchItems[i]);
    }
  }
  const data = JSON.stringify(previewItems);
  const blob = new Blob([data], { type: "text/plain" });

  const headers = new Headers();

  headers.append("Content-Disposition", 'attachment; filename="spiel-preview-parents.json"');
  headers.append("Content-Type", "application/json");
  headers.append("Cache-Control", "no-store");

  return new Response(blob, {
    headers,
  });
}
