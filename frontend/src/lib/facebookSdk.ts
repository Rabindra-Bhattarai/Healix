export interface FacebookLoginResponse {
  authResponse?: { accessToken: string };
  status: string;
}

interface FacebookSdk {
  init: (params: { appId: string; version: string; cookie?: boolean; xfbml?: boolean }) => void;
  login: (callback: (response: FacebookLoginResponse) => void, options?: { scope: string }) => void;
}

declare global {
  interface Window {
    FB?: FacebookSdk;
    fbAsyncInit?: () => void;
  }
}

let loadPromise: Promise<void> | null = null;

export function loadFacebookSdk(appId: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.FB) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    window.fbAsyncInit = () => {
      window.FB!.init({ appId, version: "v19.0", cookie: true, xfbml: false });
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  });

  return loadPromise;
}

export function facebookLogin(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
      reject(new Error("Facebook SDK not loaded"));
      return;
    }
    window.FB.login(
      (response) => {
        if (response.authResponse?.accessToken) {
          resolve(response.authResponse.accessToken);
        } else {
          reject(new Error("Facebook login was cancelled"));
        }
      },
      { scope: "email,public_profile" }
    );
  });
}
