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

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Failed to fetch data");
    }

    return result;
  } catch (error) {
    console.error(`[serverFetch] ${path}:`, (error as Error).message);
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
