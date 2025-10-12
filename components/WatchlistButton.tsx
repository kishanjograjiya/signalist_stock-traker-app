"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import {
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
} from "@/lib/actions/watchlist.actions";

export const WatchlistButton = ({ symbol, company }: WatchlistButtonProps) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkWatchlistStatus = async () => {
      try {
        const status = await isInWatchlist(symbol);
        setInWatchlist(status);
      } catch (error) {
        console.error("Error checking watchlist status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkWatchlistStatus();
  }, [symbol]);

  const handleClick = async () => {
    try {
      setLoading(true);
      if (inWatchlist) {
        await removeFromWatchlist(symbol);
        setInWatchlist(false);
      } else {
        await addToWatchlist({ symbol, company });
        setInWatchlist(true);
      }
    } catch (error) {
      console.error("Error updating watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={`watchlist-btn ${inWatchlist ? "watchlist-remove" : ""}`}
    >
      <Star className={`h-4 w-4 mr-2 ${inWatchlist ? "fill-current" : ""}`} />
      {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
    </Button>
  );
};
