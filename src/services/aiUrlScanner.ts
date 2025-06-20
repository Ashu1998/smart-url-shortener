import axios from "axios";

type ScanSuccessResult = {
  success: boolean;
  isMalicious: boolean;
}

type ScanErrorResult = {
  success: false;
  error: string;
}

export async function isMaliciousUrl(url: string) : Promise<ScanSuccessResult | ScanErrorResult>{
  try{
    const AI_URL = process.env.AI_URL || "http://localhost:5000";
    const response = await axios.post(`${AI_URL}/scan`, { url })
    console.log("[isMaliciousUrl]",url,response.data);
    const label = response?.data?.label?.toLowerCase();

    if(!label) {
      return {success: false, error: "No label found"};
    }

    const isMalicious = label === "malicious" || label === "phishing" || label === "malware";

    return {
      "success": true,
      "isMalicious": isMalicious
    }
  } catch(error) {
    console.error("Error scanning URL:", error);
    return {success: false, error: "Failed to scan URL"};
  }  
}