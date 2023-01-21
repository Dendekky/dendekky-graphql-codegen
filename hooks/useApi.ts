import axios from "axios";
import useSWR from "swr";

function useApi(url: string, shouldFetch = true) {
  const { data, error } = useSWR(shouldFetch ? url : null, fetcher, {
    revalidateOnFocus: false,
    onError: (err) => console.log(err),
  });

  return {
    data,
    loading: !error && !data,
    error,
  };
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
export default useApi;
