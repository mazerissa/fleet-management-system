interface ButtonProps {

    children: React.ReactNode;

    onClick?: ()=>void;

}


export default function Button({
    children,
    onClick
}: ButtonProps){

    return (

        <button
            onClick={onClick}
            className="rounded bg-blue-600 px-4 py-2 text-white"
        >

            {children}

        </button>

    );
}