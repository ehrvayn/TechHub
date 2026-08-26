import ProductCard from "./ProductCard";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  image_url: string | null;
  alt_text: string | null;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });
  return res.json();
}

async function ProductFeed() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
        <p className="font-mono text-sm text-zinc-500">
          No components listed yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          productId={product.id}
          name={product.name}
          price={product.price}
          category={product.category}
          stock={product.stock}
          imageUrl={product.image_url}
          altText={product.alt_text}
        />
      ))}
    </div>
  );
}

export default ProductFeed;
