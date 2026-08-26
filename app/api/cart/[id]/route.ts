import {
  handleUpdateCartItem,
  handleDeleteCartItem,
} from "@/lib/controllers/cartController";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleUpdateCartItem(Number(id), request);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleDeleteCartItem(Number(id));
}
