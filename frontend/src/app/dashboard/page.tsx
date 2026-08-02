const cards = [
{
title:"Total Vehicles",
value:"124"
},
{
title:"Active Employees",
value:"86"
},
{
title:"Monthly Distance",
value:"42,540 km"
},
{
title:"Weekend Usage",
value:"12"
}
];


export default function Dashboard(){


return (

<div className="space-y-8">


<div>

<h1 className="
text-3xl
font-bold
">

Fleet Overview

</h1>


<p className="text-slate-500">

Track vehicles, employees and usage statistics.

</p>

</div>



<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-4
gap-6
">


{
cards.map((card)=>(


<div
key={card.title}
className="
bg-white
rounded-2xl
p-6
shadow-sm
border
hover:shadow-md
transition
"
>


<p className="
text-sm
text-slate-500
">

{card.title}

</p>


<p className="
text-3xl
font-bold
mt-3
">

{card.value}

</p>


</div>


))
}


</div>



<div
className="
bg-white
rounded-2xl
p-6
border
shadow-sm
"
>

<h2 className="font-semibold text-lg">

Recent Activity

</h2>


<p className="text-slate-500 mt-3">

No activity recorded yet.

</p>


</div>



</div>

);

}