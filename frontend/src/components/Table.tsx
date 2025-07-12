import Image from "next/image";

const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
     data && data.length !==0 ?
      <table className="w-full  mb-3 mt-6">
        <thead>
          <tr className="text-left text-gray-900 text-sm">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={`pb-2 ${col.className || ""}`} // Adds spacing below the headers
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => renderRow(item))}
        </tbody>
      </table>
    : <div className="text-center text-sm text-gray-700 mt-8">
          <div className="flex justify-center items-center h-full">
            <Image src="/nowdata.png" alt="No Data" width={400} height={100}  />
          </div>
          <div className="flex flex-col items-center justify-center text-center mb-4">
            <h1 className="text-base font-bold  text-red-600 mt-2 ">Resultat Non Trouvé</h1>
            <p className=" text-gray-600 my-1">Pas d'informations à afficher!</p>
          </div>

      </div>
  );
};

export default Table;

// data.length !==0 ?
// <table className="w-full mt-8 mb-3">
//   <thead>
//     <tr className="text-left text-gray-900 text-sm">
//       {columns.map((col) => (
//         <th
//           key={col.accessor}
//           className={`pb-2 ${col.className || ""}`} // Adds spacing below the headers
//         >
//           {col.header}
//         </th>
//       ))}
//     </tr>
//   </thead>
//   <tbody>
//     {data.map((item) => renderRow(item))}
//   </tbody>
// </table>
// : <div className="text-center text-sm text-gray-700 mt-10">
//     <h1 className="text-base">* Pas de données à afficher ! *</h1>
// </div>