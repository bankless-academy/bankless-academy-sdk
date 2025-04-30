import React, { useState, useEffect } from "react";
import Frame from "./Frame";

interface Lesson {
  name: string;
  slug: string;
  lessonImageLink: string;
  description: string;
  url: string;
}

interface LessonsProps {
  lessonSlugs: string[];
}

const API_URL = "https://app.banklessacademy.com/api/lessons";

export default function Lessons({
  lessonSlugs,
}: LessonsProps): React.ReactElement {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLessonUrl, setSelectedLessonUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Filter lessons based on provided slugs
        const filteredLessons = data.filter((lesson: any) =>
          lessonSlugs.includes(lesson.slug)
        );

        // Format lessons for display
        const formattedLessons = filteredLessons.map((lesson: any) => ({
          name: lesson.name,
          slug: lesson.slug,
          lessonImageLink: lesson.lessonImageLink,
          description: lesson.description,
          url: lesson.lessonLinks.en,
        }));

        setLessons(formattedLessons);
      } catch (err) {
        console.error("Error fetching lessons:", err);
        setError("Failed to load lessons. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [lessonSlugs]);

  if (loading) {
    return <div className="lessons-loading">Loading lessons...</div>;
  }

  if (error) {
    return <div className="lessons-error">{error}</div>;
  }

  if (selectedLessonUrl) {
    return (
      <Frame
        url={selectedLessonUrl}
        onClose={() => setSelectedLessonUrl(null)}
      />
    );
  }

  return (
    <>
      <div className="lessons-grid">
        {lessons.map((lesson: Lesson) => (
          <div
            key={lesson.slug}
            className="lesson-card"
            onClick={() => setSelectedLessonUrl(lesson.url)}
          >
            <img
              src={lesson.lessonImageLink}
              alt={lesson.name}
              className="lesson-image"
            />
            <div className="lesson-content">
              <h3 className="lesson-title">{lesson.name}</h3>
              <p className="lesson-description">{lesson.description}</p>
            </div>
          </div>
        ))}
      </div>
      <style>
        {`
          .lessons-loading,
          .lessons-error {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 200px;
          }

          .lessons-error {
            color: #e53e3e;
          }

          .lessons-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
            padding: 1rem;
            background-color: #f7fafc;
            border-radius: 0.5rem;
          }

          .lesson-card {
            background-color: white;
            border-radius: 0.5rem;
            padding: 1rem;
            cursor: pointer;
            transition: opacity 0.2s;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .lesson-card:hover {
            opacity: 0.8;
          }

          .lesson-image {
            height: 120px;
            width: 100%;
            object-fit: cover;
            border-radius: 0.375rem;
          }

          .lesson-content {
            margin-top: 0.75rem;
            text-align: center;
          }

          .lesson-title {
            font-weight: 600;
            color: #2d3748;
            margin: 0;
          }

          .lesson-description {
            font-size: 0.875rem;
            color: #718096;
            margin: 0.5rem 0 0;
          }

          @media (prefers-color-scheme: dark) {
            .lessons-grid {
              background-color: #2d3748;
            }

            .lesson-card {
              background-color: #4a5568;
            }

            .lesson-title {
              color: #f7fafc;
            }

            .lesson-description {
              color: #cbd5e0;
            }
          }
        `}
      </style>
    </>
  );
}
