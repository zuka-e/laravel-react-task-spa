import { useLocation } from 'react-router-dom';

// クエリパラメータ用カスタムフック
export const useQuery = () => new URLSearchParams(useLocation().search);

export default useQuery;
