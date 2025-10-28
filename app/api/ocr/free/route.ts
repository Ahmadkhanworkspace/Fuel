import { NextRequest, NextResponse } from "next/server";

// Free OCR using OCR.space API (free tier: 25,000 requests/month)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    // Call OCR.space API (free alternative to Google Vision)
    const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apikey: process.env.OCR_SPACE_API_KEY || "helloworld", // Free tier default key
        base64image: `data:${file.type};base64,${base64}`,
        language: "eng",
        isOverlayRequired: false,
        iscreatesearchablepdf: false,
        issearchablepdfhidetextlayer: false,
      }),
    });

    const ocrData = await ocrResponse.json();

    if (ocrData.OCRExitCode !== 1) {
      return NextResponse.json(
        { error: "OCR failed", details: ocrData.ErrorMessage },
        { status: 500 }
      );
    }

    // Extract text and confidence
    const text = ocrData.ParsedResults?.[0]?.ParsedText || "";
    const confidence = ocrData.ParsedResults?.[0]?.ErrorMessage === "Success" ? 95 : 50;

    // Parse fuel receipt data
    const parsedData = parseReceiptText(text);

    return NextResponse.json({
      text,
      confidence,
      parsed: parsedData,
    });
  } catch (error) {
    console.error("OCR Error:", error);
    return NextResponse.json(
      { error: "Failed to process OCR" },
      { status: 500 }
    );
  }
}

function parseReceiptText(text: string) {
  const result: any = {
    liters: null,
    price: null,
    total: null,
    date: null,
    odometer: null,
  };

  // Extract liters (e.g., "45.50 L" or "45.50L" or "45.50 liters")
  const litersMatch = text.match(/(\d+\.?\d*)\s*[Ll]\s*(?:iters)?|(\d+\.?\d*)\s*Liters/);
  if (litersMatch) {
    result.liters = parseFloat(litersMatch[1] || litersMatch[2]);
  }

  // Extract price (e.g., "₹3,820.50" or "PKR 3820.50")
  const priceMatches = [
    text.match(/PKR\s*(\d+(?:,\d+)*(?:\.\d+)?)/i),
    text.match(/₨\s*(\d+(?:,\d+)*(?:\.\d+)?)/),
    text.match(/Rs\.?\s*(\d+(?:,\d+)*(?:\.\d+)?)/),
    text.match(/Total[:\s]+(\d+(?:,\d+)*(?:\.\d+)?)/i),
  ];
  for (const match of priceMatches) {
    if (match) {
      result.price = parseFloat(match[1].replace(/,/g, ""));
      break;
    }
  }

  // Extract date
  const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (dateMatch) {
    result.date = `${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}`;
  }

  // Extract odometer reading
  const odometerMatch = text.match(/Odometer[\s:]+(\d+)|KM[\s:]+(\d+)/i);
  if (odometerMatch) {
    result.odometer = parseInt(odometerMatch[1] || odometerMatch[2]);
  }

  return result;
}

