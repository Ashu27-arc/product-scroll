import { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import debounce from "lodash.debounce";

const fetchProducts = async (query = "", page = 1) => {
  const res = await fetch(`http://localhost:5000/api/products?search=${query}&page=${page}`);
  return res.json();
};

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(query, 1).then((data) => setProducts(data.products));
  }, [query]);

  const loadMore = async () => {
    const nextPage = page + 1;
    const data = await fetchProducts(query, nextPage);
    if (data.products.length === 0) setHasMore(false);
    setProducts((prev) => [...prev, ...data.products]);
    setPage(nextPage);
  };

  const handleSearch = useCallback(
    debounce((value) => {
      setQuery(value);
    }, 500),
    []
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search products..."
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <InfiniteScroll
        dataLength={products.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<p>Loading...</p>}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="p-4 border rounded shadow">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <h3 className="mt-2 font-bold">{product.name}</h3>
              <p>${product.price}</p>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
