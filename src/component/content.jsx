import { ArrowLeft, MessageSquare } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ContentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scrollToIndex = parseInt(searchParams.get("scrollTo"), 10);
  const postRefs = useRef([]);
  const scrollContainerRef = useRef(null);

  const [publicStyles, setPublicStyles] = useState([]);
  const [liked, setLiked] = useState([]);

  // const randomImages = Array.from(
  //   { length: 20 },
  //   (_, i) => `https://picsum.photos/seed/${i + 1}/300/300`
  // );

  useEffect(() => {
    const fetchPublicStyles = async () => {
      const { data, error } = await supabase
        .from("v_style_with_user")
        .select("*")
        .eq("status", "public")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal ambil style:", error.message);
      } else {
        setPublicStyles(data);
        setLiked(Array(data.length).fill(false)); // Init state like
      }
    };

    fetchPublicStyles();
  }, []);

  useEffect(() => {
    if (
      !isNaN(scrollToIndex) &&
      postRefs.current[scrollToIndex] &&
      scrollContainerRef.current
    ) {
      const targetOffset = postRefs.current[scrollToIndex].offsetTop;
      scrollContainerRef.current.scrollTop = targetOffset;
    }
  }, [scrollToIndex, publicStyles]);

  const toggleLike = (index) => {
    const newLiked = [...liked];
    newLiked[index] = !newLiked[index];
    setLiked(newLiked);
  };

  return (
    <>
      <div className="konten bg-black min-h-screen flex flex-col">
        {/* Navbar */}
        <div className="nav h-14 flex px-4 items-center justify-center">
          <div
            className="ikon absolute left-4 text-[#FFF313]"
            onClick={() => navigate(`/home`)}
          >
            <ArrowLeft />
          </div>
          <h1
            className="text-[#FFF313] text-xl font-bold"
            style={{ fontFamily: "Redressed" }}
          >
            M2Outfit
          </h1>
        </div>
        <hr className="border-t border-[#FFF313] mx-4" />

        {/* Scrollable Content Area */}
        <div
          ref={scrollContainerRef}
          className="post flex flex-col gap-4 overflow-y-auto h-[calc(100vh-56px-1px)] snap-y snap-mandatory"
        >
          {publicStyles.map((style, index) => (
            <div
              key={style.style_id}
              className="post snap-start"
              ref={(el) => (postRefs.current[index] = el)}
            >
              {/* User Info */}
              <div className="user flex gap-4 items-center py-3 px-3">
                <img
                  src={`https://i.pravatar.cc/40?img=${index + 1}`}
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="text-xs text-white font-bold">
                  {style.username || "Anonim"}
                </p>
              </div>

              {/* Image & Reactions */}
              <div className="img-post">
                <img
                  src={style.gambar}
                  alt={style.style_name}
                  className="w-full aspect-square object-cover"
                />
                <div className="react flex gap-6 py-4 text-white px-3">
                  <button onClick={() => toggleLike(index)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={liked[index] ? "red" : "none"}
                      stroke={liked[index] ? "red" : "white"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                  <button>
                    <MessageSquare />
                  </button>
                </div>

                {/* Description */}
                <div className="desc px-3">
                  <h5 className="text-xs font-bold text-white">
                    {style.style_name}
                  </h5>
                  <p className="text-white text-xs">
                    {`"${style.style_name}" oleh ${style.username || "user"}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
