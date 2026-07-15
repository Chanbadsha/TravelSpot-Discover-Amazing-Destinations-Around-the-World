export const serverMutation = async (path: string, data: unknown) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Request failed");
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Something went wrong",
    };
  }
};

export const serverFetch = async (path: string, query: Record<string, string> = {}, options: RequestInit = {}) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is not set");
    }

    const queryString = new URLSearchParams(query).toString();

    const response = await fetch(
      `${apiUrl}/${path}?${queryString}`,
      { ...options, next: { revalidate: 0 } },
    );

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      if (contentType.includes("application/json")) {
        const err = await response.json();
        throw new Error(err?.message || "Failed to fetch data");
      }
      throw new Error(`Request failed with status ${response.status}`);
    }

    if (!contentType.includes("application/json")) {
      throw new Error(`Unexpected response type: ${contentType}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { data: [], error: (error as Error).message };
  }
};

export const serverPatch = async (path: string, data: unknown) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Request failed");
    }

    return result;
  } catch (error) {
    return [];
  }
};

export const serverDelete = async (path: string, data: unknown) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Request failed");
    }

    return result;
  } catch (error) {
    return [];
  }
};
