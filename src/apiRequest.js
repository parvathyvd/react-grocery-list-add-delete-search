const apiRequest = async (url = "", options = null, errMsg = null) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw Error("Something went wrong!");
  } catch (err) {
    errMsg = err.message;
  } finally {
    return errMsg;
  }
};

export default apiRequest;
