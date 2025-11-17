import { getNews } from "@/lib/actions/finnhub.action";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const NewsCard = async ({ watchlist }: { watchlist: string[] }) => {
	const news = await getNews(watchlist);
	console.log(news);
	return (
		<div className="flex flex-row gap-4 mt-10 min-h-84 flex-wrap justify-around">
			{news.map((article: MarketNewsArticle) => {
				return (
					<div
						key={article.id}
						className="rounded-2xl flex flex-col gap-2 bg-gray-700 p-4 max-w-[350px] mb-4"
					>
						<p className="bg-green-700 rounded-2xl h-7 text-green-400 max-w-16 font-bold p-2 flex items-center justify-center">
							{article.related}
						</p>
						<h3 className="text-lg font-semibold text-white">
							{article.headline.slice(0,60) + `${article.headline.length > 60 ? "..." : ""}`}
						</h3>
						<p className="text-sm text-gray-400 font-semibold">
							{article.source}
						</p>
						<p className="text-sm text-gray-400">
							{article.summary.slice(0,125)+`${article.summary.length > 125 ? "..." : ""}`}
						</p>

						<Link
							href={article.url}
							className="text-yellow-500 hover:underline mt-2 flex"
							target="_blank"
						>
							<div className="flex items-center gap-1 justify-center">
								<span className="mb-1">Read more</span> <ArrowRight size={15} />
							</div>
						</Link>
					</div>
				);
			})}
		</div>
	);
};

export default NewsCard;
