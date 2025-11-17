import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Star } from "lucide-react";
import Link from "next/link";

type WatchlistTableProps = {
	stockDetails: {
		symbol: string;
		company: string;
		currentPrice: number;
		changePercent: number;
		priceFormatted: string;
		changeFormatted: string;
		peRatio: string;
		marketCapFormatted: string;
	}[];
};

const WatchlistTable = ({ stockDetails }: WatchlistTableProps) => {
	return (
		<div className="watchlist-table">
			<Table className="lg:text-2xl">
				<TableHeader className="table-header-row">
					<TableRow className="table-row ">
						<TableHead className="w-[100px] text-gray-200 text-center">
							Company
						</TableHead>
						<TableHead className="text-gray-200 text-center">Price</TableHead>
						<TableHead className="text-gray-200 text-center">Change</TableHead>
						<TableHead className="text-gray-200 hidden md:block text-center">
							Change Percentage
						</TableHead>
						<TableHead className="text-gray-200 text-center">
							Market Cap
						</TableHead>
						<TableHead className="text-gray-200 hidden md:block text-center">
							P/E Ratio
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{stockDetails.map((stock) => {
						const href = `/stocks/${stock.symbol}`;
						return (
							<TableRow key={stock.symbol} className="table-row">
								<TableCell className="table-cell border-r border-gray-500">
									<Link href={href} className="block w-full">
										<div className="flex items-center gap-2 ">
											<div className="bg-gray-700 rounded-full size-5 flex items-center justify-center">
												<Star
													size={10}
													fill="currentColor"
												/>
											</div>
											<span className="hidden md:block">
												{stock.company}
											</span>
											({stock.symbol})
										</div>
									</Link>
								</TableCell>

								<TableCell className="table-cell border-r border-gray-500">
									<Link href={href} className="block w-full">
										{stock.priceFormatted}
									</Link>
								</TableCell>

								<TableCell className="table-cell border-r border-gray-500">
									<Link href={href} className="block w-full">
										{stock.changeFormatted}
									</Link>
								</TableCell>

								<TableCell className="font-medium text-base text-center hidden md:block md:border-r border-gray-500">
									<Link href={href} className="block w-full text-center">
										{stock.changePercent}
									</Link>
								</TableCell>

								<TableCell className="table-cell md:border-r border-gray-500">
									<Link href={href} className="block w-full">
										{stock.marketCapFormatted}
									</Link>
								</TableCell>

								<TableCell className="font-medium text-base text-center hidden md:block ">
									<Link href={href} className="block w-full text-center">
										{stock.peRatio}
									</Link>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
};

export default WatchlistTable;
