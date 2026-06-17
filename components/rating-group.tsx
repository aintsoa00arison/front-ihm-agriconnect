"use client";

import { RatingGroup } from "@ark-ui/react/rating-group";
import { StarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { apiClient } from "@/app/services/api/client";
import { toast } from "sonner";

type Props = {
  assessorId: string;
  assesseeId: string;
};

export default function BasicRating({ assessorId, assesseeId }: Props) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alreadyEvaluated, setAlreadyEvaluated] = useState(false);

  const ratingLabels = [
    "Mauvaise",
    "Correcte",
    "Bonne",
    "Très bonne",
    "Excellente",
  ];

  // Vérifie si l'assessor a déjà évalué l'assessee
  useEffect(() => {
    if (!assessorId || !assesseeId) return;
    const check = async () => {
      try {
        const res = await apiClient.get(`/evaluation/all/${assesseeId}`);
        const evals: any[] = res.data;
        const already = evals.some((e) => e.assessor_id === assessorId);
        setAlreadyEvaluated(already);
      } catch {
        // silencieux
      }
    };
    check();
  }, [assessorId, assesseeId]);

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Veuillez attribuer une note.");
      return;
    }
    if (!review.trim()) {
      toast.error("Un commentaire est obligatoire.");
      return;
    }
    setIsLoading(true);
    try {
      await apiClient.post("/evaluation/create", {
        assessor_id: assessorId,
        assessee_id: assesseeId,
        rating_value: rating,
        review: review.trim(),
      });
      toast.success("Évaluation publiée !");
      setAlreadyEvaluated(true);
    } catch (error: any) {
      if (error.response?.status === 409) {
        setAlreadyEvaluated(true);
        toast.error("Vous avez déjà évalué cet utilisateur.");
      } else {
        toast.error(error.response?.data?.detail || "Erreur lors de l'envoi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (alreadyEvaluated) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground text-sm">
            Vous avez déjà évalué cet utilisateur.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Note</CardTitle>
        <CardDescription className="text-muted-foreground">
          Comment évalueriez-vous votre expérience ?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RatingGroup.Root
          count={5}
          value={rating}
          onValueChange={(details) => setRating(details.value)}
          allowHalf
        >
          <RatingGroup.Control className="inline-flex">
            <RatingGroup.Context>
              {({ items }) =>
                items.map((item) => (
                  <RatingGroup.Item
                    key={item}
                    index={item}
                    className="size-8 p-1 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded-lg hover:scale-110 transition-transform"
                  >
                    <RatingGroup.ItemContext>
                      {({ half, highlighted }) => {
                        if (half)
                          return (
                            <div className="relative size-6">
                              <StarIcon className="size-6 text-gray-300" />
                              <div className="absolute inset-0 overflow-hidden w-1/2">
                                <StarIcon className="size-6 text-yellow-400 fill-current" />
                              </div>
                            </div>
                          );
                        if (highlighted)
                          return (
                            <StarIcon className="size-6 text-yellow-400 fill-current" />
                          );
                        return <StarIcon className="size-6 text-gray-300" />;
                      }}
                    </RatingGroup.ItemContext>
                  </RatingGroup.Item>
                ))
              }
            </RatingGroup.Context>
            <RatingGroup.HiddenInput />
          </RatingGroup.Control>
        </RatingGroup.Root>

        {rating > 0 && (
          <div className="pt-2">
            <p className="text-sm font-medium">
              {rating} étoile{rating !== 1 ? "s" : ""} —{" "}
              {ratingLabels[Math.ceil(rating) - 1]}
            </p>
          </div>
        )}

        <Textarea
          placeholder="Partagez votre expérience..."
          className="mt-4 border-border bg-neutral/50 resize-none"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </CardContent>
      <CardFooter className="justify-end gap-2 border-t border-border">
        <Button size="lg" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Envoi..." : "Publier l'avis"}
        </Button>
      </CardFooter>
    </Card>
  );
}
