export default class Helper {
  static validateUrl(url: string) : boolean {
    try {
      const urlObj = new URL(url);
      if(!urlObj.protocol) return false;

      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch(error) {
      console.error("Error validating URL:", error);
      return false;
    }
  }

  static normalizeUrl(url: string) : string {
    try {
      const urlObj = new URL(url);
      urlObj.hash = ""; // Remove the fragment;

      if(urlObj.pathname.endsWith("/")) {
        urlObj.pathname = urlObj.pathname.slice(0, -1); // Remove the trailing slash
      }

      //Remove utm parameters
      urlObj.searchParams.forEach((value, key) => {
        if(key.startsWith("utm_")) {
          urlObj.searchParams.delete(key);
        }
      })

      return urlObj.toString();
    } catch(error) {
      console.error("Error normalizing URL:", error);
      throw error;
    }
  }
}