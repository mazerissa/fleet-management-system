import Link from "next/link";
import {
  LayoutDashboard,
  Car,
  Users,
  FileText,
  Settings
} from "lucide-react";


const links = [
  {
    name:"Dashboard",
    href:"/dashboard",
    icon:LayoutDashboard
  },
  {
    name:"Vehicles",
    href:"/vehicles",
    icon:Car
  },
  {
    name:"Employees",
    href:"/employees",
    icon:Users
  },
  {
    name:"Reports",
    href:"/reports",
    icon:FileText
  },
  {
    name:"Settings",
    href:"/settings",
    icon:Settings
  }
];


export default function Sidebar(){

return (

<aside className="
w-72
bg-slate-950
text-white
p-6
hidden
md:block
">


<div className="mb-10">

<h1 className="
text-2xl
font-bold
tracking-tight
">

Fleet<span className="text-blue-400">Manager</span>

</h1>

<p className="text-sm text-slate-400 mt-2">
Company vehicle control
</p>

</div>


<nav className="space-y-2">


{
links.map((link)=>{

const Icon = link.icon;


return (

<Link
key={link.href}
href={link.href}
className="
flex
items-center
gap-3
rounded-xl
px-4
py-3
text-slate-300
hover:bg-slate-800
hover:text-white
transition
"
>


<Icon size={20}/>

<span>
{link.name}
</span>


</Link>

)

})
}


</nav>


<div className="
absolute
bottom-6
text-xs
text-slate-500
">

v1.0 Fleet System

</div>


</aside>

);

}