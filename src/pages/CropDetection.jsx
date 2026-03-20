import Navbar from "../components/Navbar"
import Card from "../components/Card"

export default function CropDetection(){

return(

<div className="bg-light min-h-screen">

<Navbar/>

<div className="p-10 grid grid-cols-2 gap-8">

<Card title="Crop Disease Detection">

<img
src="https://images.unsplash.com/photo-1598515214211-89d3c73ae83b"
className="rounded"
/>

</Card>


<Card title="Voice Query Diagnosis">

<p className="mb-4">
"The leaves on my tomato plants have dark spots"
</p>

<button className="bg-primary text-white px-6 py-2 rounded">
🎤 Record Voice
</button>

</Card>

</div>

</div>

)

}