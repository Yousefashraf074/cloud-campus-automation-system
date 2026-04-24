export const storeUserSession = ({ token, role, name, email }) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('userRole', role);
  localStorage.setItem('userName', name);
  localStorage.setItem('userEmail', email);
};

export const clearUserSession = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
};

export const getToken = () => localStorage.getItem('authToken');
export const getUserRole = () => localStorage.getItem('userRole');
export const getUserName = () => localStorage.getItem('userName');
