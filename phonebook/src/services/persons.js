import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

const getAll = () => axios.get(baseUrl).then((r) => r.data);
const create = (newObj) => axios.post(baseUrl, newObj).then((r) => r.data);
const update = (id, newObj) =>
  axios.put(`${baseUrl}/${id}`, newObj).then((r) => r.data);
const deleteAxios = (id) =>
  axios.delete(`${baseUrl}/${id}`).then((r) => r.data);
export default { getAll, create, update, deleteAxios };
