import { TableCell, TableRow } from '@/components/ui/table';
import Image from 'next/image';

export function Product({
  product,
  idx,
  setIsModalOpen
}: {
  product: any;
  idx: number;
  setIsModalOpen: (id: null | number, isOpen: boolean) => void;
}) {
  return (
    <>
      <TableRow
        onClick={() => {
          console.log(idx);
          setIsModalOpen(idx, true);
        }}
      >
        <TableCell className="font-medium text-center text-[13px] p-1 ">
          {idx + 1}
        </TableCell>
        <TableCell>
          <Image
            src={product.imageUrl}
            alt="Food Image"
            unoptimized
            width={100}
            height={100}
          />
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
          {Array.isArray(product.categories) ? (
            product.categories.map((c: any, idx: number) => (
              <p
                key={idx}
                className="flex flex-row text-[13px] justify-between font-bold"
              >
                <span>{c}</span>
              </p>
            ))
          ) : (
            <p className="text-[13px]">No Categories</p>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}
