import axios from "axios";
let GET_URL = "http://localhost:8080/movies/";
let POST_URL = "http://localhost:8080/movies/add";
let ID_URL = "http://localhost:8080/movies/";

export async function postMovie(
  name,
  duration,
  gender,
  director,
  category,
  publishDate
) {
  const data = {
    name,
    duration,
    gender,
    director,
    category,
    publishDate,
  };

  console.log("data", data);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  try {
    const response = await fetch(POST_URL, options);
    if (!response.ok) {
      throw new Error("Error al enviar los datos");
    }
    const responseData = await response.json();
    console.log("Respuesta del servidor:", responseData);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getMovies() {
  try {
    const response = await axios.get(GET_URL);
    return response.data.results;
  } catch (error) {
    throw error;
  }
}

export async function deleteMovie(id) {
  try {
    const response = await axios.delete(`${ID_URL}${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateMovie(id, data) {
  console.log("data", data);
  try {
    const response = await axios.put(`${ID_URL}${id}`, data);
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getMovieById(id) {
  try {
    const response = await axios.get(`${ID_URL}${id}`);
    return response.data.results;
  } catch (error) {
    throw error;
  }
}
