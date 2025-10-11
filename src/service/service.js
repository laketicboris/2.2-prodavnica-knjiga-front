import AxiosConfig from "../config/axios.config";

// Publishers
const PUBLISHERS_RESOURCE = "api/Publishers";

export async function getAllPublishers(sortType = 0) {
  const { data } = await AxiosConfig.get(`${PUBLISHERS_RESOURCE}?sortType=${sortType}`);
  return data;
}

export async function getPublisherSortTypes() {
  const { data } = await AxiosConfig.get(`${PUBLISHERS_RESOURCE}/sortTypes`);
  return data;
}

export async function getPublisherById(id) {
  const { data } = await AxiosConfig.get(`${PUBLISHERS_RESOURCE}/${id}`);
  return data;
}

export async function createPublisher(publisherData) {
  const { data } = await AxiosConfig.post(PUBLISHERS_RESOURCE, publisherData);
  return data;
}

export async function updatePublisher(id, publisherData) {
  const { data } = await AxiosConfig.put(`${PUBLISHERS_RESOURCE}/${id}`, publisherData);
  return data;
}

export async function deletePublisher(id) {
  const { data } = await AxiosConfig.delete(`${PUBLISHERS_RESOURCE}/${id}`);
  return data;
}

// Books
const BOOKS_RESOURCE = "api/Books";

export async function getAllBooks(sortType = 0) {
  const { data } = await AxiosConfig.get(`${BOOKS_RESOURCE}?sortType=${sortType}`);
  return data;
}

export async function getFilteredAndSortedBooks(filter, sortType = 0) {
  const { data } = await AxiosConfig.post(`${BOOKS_RESOURCE}/filterAndSort?sortType=${sortType}`, filter);
  return data;
}

export async function getBookSortTypes() {
  const { data } = await AxiosConfig.get(`${BOOKS_RESOURCE}/sortTypes`);
  return data;
}

export async function getBookById(id) {
  const { data } = await AxiosConfig.get(`${BOOKS_RESOURCE}/${id}`);
  return data;
}

export async function createBook(bookData) {
  const { data } = await AxiosConfig.post(BOOKS_RESOURCE, bookData);
  return data;
}

export async function updateBook(id, bookData) {
  const { data } = await AxiosConfig.put(`${BOOKS_RESOURCE}/${id}`, bookData);
  return data;
}

export async function deleteBook(id) {
  const { data } = await AxiosConfig.delete(`${BOOKS_RESOURCE}/${id}`);
  return data;
}

// Authors
const AUTHORS_RESOURCE = "api/Authors";
export async function getAllAuthors(pageNumber = 1, pageSize = 5) {
  const { data } = await AxiosConfig.get(`${AUTHORS_RESOURCE}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return data;
}
export async function getAuthorById(id) {
  const { data } = await AxiosConfig.get(`${AUTHORS_RESOURCE}/${id}`);
  return data;
}
export async function createAuthor(authorData) {
  console.log("service.js - createAuthor called with:", authorData);
  console.log("AUTHORS_RESOURCE:", AUTHORS_RESOURCE);
  
  try {
    const { data } = await AxiosConfig.post(AUTHORS_RESOURCE, authorData);
    console.log("service.js - createAuthor success:", data);
    return data;
  } catch (error) {
    console.error("service.js - createAuthor error:", error.response?.data);
    throw error;
  }
}
export async function updateAuthor(id, authorData) {
  const { data } = await AxiosConfig.put(`${AUTHORS_RESOURCE}/${id}`, authorData);
  return data;
}
export async function deleteAuthor(id) {
  const { data } = await AxiosConfig.delete(`${AUTHORS_RESOURCE}/${id}`);
  return data;
}