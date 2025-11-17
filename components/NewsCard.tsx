const NewsCard = () => {
  return (
	<div className="rounded-2xl flex flex-col bg-gray-600 p-4 max-w-96">
		<p className="bg-green-700 rounded-2xl h-7 text-green-400 max-w-16 font-bold p-2 flex items-center justify-center">GOOGLE</p>
	  <h3 className="text-lg font-semibold text-white">News Title</h3>
	  <p className="text-sm text-gray-400">Short description of the news article.</p>
	  
	</div>
  )
}

export default NewsCard
