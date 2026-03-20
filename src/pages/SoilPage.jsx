import Navbar from "../components/Navbar"
import Card from "../components/Card"

export default function SoilPage(){

return(

<div className="bg-light min-h-screen">

<Navbar/>

<div className="p-10 grid grid-cols-2 gap-8">

<Card title="Soil Moisture Levels">

<p>Detected Disease: Late Blight</p>

</Card>


<Card title="Fertilizer Recommendation">

<ul className="list-disc ml-4">
<li>Use NPK 10-30-20 fertilizer</li>
<li>Water plants in morning</li>
<li>Remove infected leaves</li>
</ul>

</Card>

</div>

</div>

)

}