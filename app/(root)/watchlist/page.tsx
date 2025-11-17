import { Star } from "lucide-react";
import { getStocksDetails, searchStocks } from "@/lib/actions/finnhub.action";
import SearchCommand from "@/components/SearchCommand";
import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserWatchlistSymbols } from "@/lib/actions/watchlist.action";
import WatchlistTable from "@/components/WatchlistTable";
import NewsCard from "@/components/NewsCard";

const Watchlist = async () => {
	const auth = await getAuth();
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user) redirect("/sign-in");
	const watchlist = await getUserWatchlistSymbols(session.user.id);
	const stockDetails = await Promise.all(
		watchlist.map((symbol) => getStocksDetails(symbol))
	);
	const initialStocks = await searchStocks();

	// Empty state
	if (watchlist.length === 0) {
		return (
			<section className="flex watchlist-empty-container m-auto">
				<div className="watchlist-empty">
					<Star className="watchlist-star" />
					<h2 className="empty-title">Your watchlist is empty</h2>
					<p className="empty-description">
						Start building your watchlist by searching for stocks
						and adding them to your watchlist.
					</p>
				</div>
				<SearchCommand initialStocks={initialStocks} />
			</section>
		);
	}

	return (
		<>
			<section className="watchlist">
				<div className="flex flex-col gap-6">
					<div className="flex items-center justify-between">
						<h2 className="watchlist-title">Watchlist</h2>
						<SearchCommand initialStocks={initialStocks} />
					</div>
					<div>
						<WatchlistTable stockDetails={stockDetails} />
					</div>
				</div>
			</section>
			{/* <section className="mt-10 mb-20">
				<div className="news">
					<h2 className="watchlist-title">News</h2>
					<NewsCard/>
				</div>
			</section> */}
		</>
	);
};

export default Watchlist;
