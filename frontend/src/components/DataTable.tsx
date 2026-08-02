interface DataTableProps {

    headers:string[];

    rows:string[][];

}


export default function DataTable({
    headers,
    rows
}:DataTableProps){


    return (

        <table className="w-full border">


            <thead>

                <tr>

                {
                    headers.map((header)=>(

                        <th
                        key={header}
                        className="border p-2 text-left"
                        >

                            {header}

                        </th>

                    ))
                }

                </tr>

            </thead>


            <tbody>

            {
                rows.map((row,index)=>(

                    <tr key={index}>

                        {
                            row.map((cell)=>(

                                <td
                                key={cell}
                                className="border p-2"
                                >
                                    {cell}
                                </td>

                            ))
                        }

                    </tr>

                ))
            }

            </tbody>


        </table>

    );

}