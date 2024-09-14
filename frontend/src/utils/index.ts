import { AxiosResponse } from "axios";
export const requestHandler = async (
    api: () => Promise<AxiosResponse<any>>,
    setLoading: ((loading: boolean) => void) | null,
    onSuccess: (data: any) => void,
    onError: (error: string) => void
  ) => {
    // Show loading state if setLoading function is provided
    setLoading && setLoading(true);
    try {
      // Make the API request
      const response = await api();
      const { data } = response;
      if (data?.success) {
        // Call the onSuccess callback with the response data
        onSuccess(data);
      }
    } catch (error: any) {
      // Handle error cases, including unauthorized and forbidden cases
      if ([401, 403].includes(error?.response.data?.statusCode)) {
        localStorage.clear(); // Clear local storage on authentication issues
        if (isBrowser) window.location.href = "/login"; // Redirect to login page
      }
      onError(error);
    } finally {
      // Hide loading state if setLoading function is provided
      setLoading && setLoading(false);
    }
  };
  export const isBrowser = typeof window !== "undefined";
  export function formatNumber(num:number) {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
      return num.toString();
    }
  }
  
