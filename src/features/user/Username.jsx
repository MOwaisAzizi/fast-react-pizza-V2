import { useSelector } from "react-redux";

function Username() {
  const store = useSelector(store=>store.user.username)

  if(!store) return null
  
  return <div className="hidden text-sm font-semibold md:block">{store}</div>;
}

export default Username;
