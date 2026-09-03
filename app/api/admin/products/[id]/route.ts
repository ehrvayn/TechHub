import {
  handleUpdateProduct,
  handleDeleteProduct,
} from "@/lib/controllers/adminProductController";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleUpdateProduct(Number(id), request);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleDeleteProduct(Number(id));
}
