interface ModalProps {

    open:boolean;

    children:React.ReactNode;

}


export default function Modal({
    open,
    children
}:ModalProps){


    if(!open){
        return null;
    }


    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">


            <div className="bg-white rounded p-6">

                {children}

            </div>


        </div>

    );

}