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
  publishDate,
  file
) {
  const data = {
    name,
    duration,
    gender,
    director,
    category,
    publishDate,
    urlImage: "1",
  };

  const fd = new FormData();
  fd.append(
    "movieRequestDTO",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  fd.append("file", file);

  try {
    const response = await axios.post(POST_URL, fd);
    return response.data;
  } catch (error) {
    throw error;
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
