import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Marquee from "@/components/Marquee";

type Review = {
  id: string;
  author_name: string;
  text: string;
  rating: number;
};

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="shrink-0 w-72 rounded-2xl border border-border bg-background-3 p-6">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} size={14} className="fill-primary text-primary" />
        ))}
      </div>
      <p className="text-sm text-foreground-2 leading-relaxed mb-4">"{review.text}"</p>
      <p className="text-sm font-medium text-foreground">{review.author_name}</p>
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    supabase
      .from("reviews")
      .select("id, author_name, text, rating")
      .eq("published", true)
      .order("created_at")
      .then(({ data }) => {
        if (data && data.length > 0) setReviews(data);
      });
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-background-2">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Co mówią nasi użytkownicy?</h2>
          <p className="text-foreground-2">Prawdziwe opinie z naszej społeczności.</p>
        </motion.div>

        <Marquee
          pauseOnHover
          className="[--duration:30s] [--gap:1.25rem]"
        >
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
