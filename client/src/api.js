const API_URL = "http://localhost:3001/api";

export async function loginUser(username) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.message || "Unable to log in"
    );
  }

  return response.json();
}

export async function saveGame(username, game) {
  const response = await fetch(
    `${API_URL}/games/${encodeURIComponent(username)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.message || "Unable to save game"
    );
  }

  return response.json();
}

export async function getUserGames(username) {
  const response = await fetch(
    `${API_URL}/games/${encodeURIComponent(username)}`
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.message || "Unable to retrieve games"
    );
  }

  return response.json();
}