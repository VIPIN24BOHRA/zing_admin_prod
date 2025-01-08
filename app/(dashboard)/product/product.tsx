import { TableCell, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { OrderDetailsModal } from '@/components/orderDetailsModal';
import ProductModal from '../../../components/productModal';
import { Trash } from 'lucide-react';

export function Product({ product, idx }: { product: any; idx: number }) {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteProductModalOpen, setDeleteIsProductModalOpen] =
    useState(false);
  return (
    <>
      <TableRow onClick={() => setIsProductModalOpen(true)}>
        <TableCell
          className="font-medium text-[13px] p-1 h-max w-max color-red text-center align-middle leading-[normal]"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteIsProductModalOpen(true);
          }}
        >
          <span className="inline-block align-middle">
            <Trash color="red" />
          </span>
        </TableCell>

        <TableCell className="font-medium text-center text-[13px] p-1 ">
          {idx + 1}
        </TableCell>

        <TableCell className="font-medium text-center text-[13px] p-1">
          {product.title}
        </TableCell>
        <TableCell className="hidden sm:table-cell text-[12px] p-1">
          <p className="w-[180px] text-ellipsis overflow-hidden ">
            {product.description}
          </p>
        </TableCell>

        <TableCell className="hidden md:table-cell text-center p-1">
          {product.originalPrice}
        </TableCell>
        <TableCell className="hidden md:table-cell text-center text-[12px] p-1">
          {product.price}
        </TableCell>
        <TableCell className="hidden md:table-cell text-center text-[12px] p-1 font-bold">
          {product.hide ? '✅' : '❌'}
        </TableCell>
        <TableCell className="hidden md:table-cell text-center text-[rgba(3,189,71,1)] font-bold p-1 text-[12px]">
          {product.isVeg ? (
            <span className="">veg</span>
          ) : (
            <span className="text-[#ff0000]">non veg</span>
          )}
        </TableCell>
        <TableCell className="hidden md:table-cell text-[12px] p-1 text-center">
          {product.servingType ? product.servingType : '-'}
        </TableCell>
        <TableCell className="hidden md:table-cell text-[12px] p-1 text-center">
          {product.quantity ? product.quantity : 'out of stock'}
        </TableCell>
        <TableCell className="font-medium text-center p-1">
          {product.categories.map((c: any, idx: number) => (
            <p
              key={c}
              className="flex flex-row text-[13px] justify-between font-bold"
            >
              <span> {c} </span>
            </p>
          ))}
        </TableCell>
      </TableRow>
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={product}
      />
    </>
  );
}
