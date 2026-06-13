"use client";

import { RatingGroup } from "@ark-ui/react/rating-group";
import { StarIcon, StarHalfIcon } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";

export default function BasicRating() {
  const [rating, setRating] = useState(0);

  const ratingLabels = ["Mauvaise", "Correcte", "Bonne", "Très bonne", "Excellente"];

  return (
    <Card >
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
                        if (half) {
                          return (
                            <div className="relative size-6">
                              <StarIcon className="size-6 text-gray-300 dark:text-gray-600" />
                              <div className="absolute inset-0 overflow-hidden w-1/2">
                                <StarIcon className="size-6 text-yellow-400 fill-current" />
                              </div>
                            </div>
                          );
                        }
                        if (highlighted) {
                          return (
                            <StarIcon className="size-6 text-yellow-400 fill-current" />
                          );
                        }
                        return (
                          <StarIcon className="size-6 text-gray-300 dark:text-gray-600" />
                        );
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
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Vous avez noté ceci {rating} étoile{rating !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {ratingLabels[Math.floor(rating) - 1]}
            </p>
          </div>
        )}

        <Textarea placeholder="Partagez le ressenti de votre expérience avec John Doe..." className="mt-4 border-border bg-neutral/50 resize-none" />
      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>
  );
}
