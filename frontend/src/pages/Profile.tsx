import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ProfileSideBar from "@/components/sections/ProfileSideBar";
import {
  Globe,
  ThumbsUpIcon,
  EllipsisVertical,
  Repeat2,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FollowButton from "@/components/modules/FollowButton";
const Profile = () => {
  const { user } = useAuth();
  const pathname = window.location.pathname;
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div>
      {user && (
        <div className="flex">
          <div className="w-[15%] md:w-1/3 border-0 border-r-[1px] h-screen">
            <ProfileSideBar />
          </div>
          <div className="md:w-2/3 overflow-y-scroll scrollbar-hide border-0 border-r-[1px] h-screen">
            <div className="flex">
              <div
                className={`w-1/2 py-5 text-center cursor-pointer ${
                  pathname == "/profile"
                    ? "font-bold text-lg text- bg-muted border-0 border-b-4 border-blue-500"
                    : "hover:bg-slate-900 duration-200"
                }`}
              >
                Profile
              </div>
              <div className="py-5 w-1/2 text-center cursor-pointer hover:bg-slate-900 duration-200">
                Edit Profile
              </div>
            </div>
            <Dialog>
              <div className="m-3 mx-auto w-44 rounded-full h-44">
                <DialogTrigger>
                  <img
                    onMouseEnter={() => {
                      setShowPreview(true);
                    }}
                    onMouseLeave={() => {
                      setShowPreview(false);
                    }}
                    src={user.profilePicture}
                    className=" mx-auto rounded-full border-[7px] border-muted hover:opacity-25  cursor-pointer"
                    alt=""
                  />
                  <ExternalLink
                    className={`w-10 cursor-pointer absolute top-[40%] hover:opacity-100 left-[40%] h-10 ${
                      showPreview ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </DialogTrigger>
                <DialogContent className="bg-transparent border-0">
                  <img
                    src={user.profilePicture}
                    className="w-full h-full"
                    alt=""
                  />
                </DialogContent>
              </div>
            </Dialog>
            <div className="text-center font-bold text-lg">{user.username}</div>
            <div className="flex justify-around">
              <div className="hover:underline cursor-pointer">0 Followers</div>
              <div className="hover:underline cursor-pointer"> 0 Following</div>
            </div>
            <div className="text-center mt-3 font-bold text-lg">Bio</div>
            <div className="text-center text-sm m-3 text-muted-foreground">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Natus
              doloribus corporis quaerat neque maxime voluptates porro ea soluta
              dolores excepturi.
            </div>
            <div className="w-full h-[2px] bg-muted"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 m-3 mx-5 gap-3">
              <div className="flex items-center gap-2">
                <div className="font-bold">College: </div>
                <div className="text-sm">
                  Sri Jayachamarajendra College of Engineering
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold">University: </div>
                <div className="text-sm">JSSSTU</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold">Graduation: </div>
                <div className="text-sm">2026</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold">Branch: </div>
                <div className="text-sm">CSE</div>
              </div>
            </div>
            <div className="w-full h-[2px] bg-muted mt-5"></div>
            <div className="posts">
              <div className="text-center font-bold text-lg mt-3">Posts</div>

              <div className="postcard m-10 mt-3">
                <div className="flex header items-center gap-2">
                  <div className="flex gap-2 items-center">
                    <div>
                      <img
                        src={user.profilePicture}
                        className="w-10 h-10 rounded-full"
                        alt=""
                      />
                    </div>
                    <div className="flex-col">
                      <div className="pl-1 font-semibold">three</div>
                      <div className="text-muted-foreground text-sm flex gap-1 items-center">
                        <Globe className="w-4 h-4" />
                        <div> 1d ago</div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto pr-10">
                    <EllipsisVertical className="h-8 cursor-pointer hover:bg-muted" />
                  </div>
                </div>
                <div className="w-3/4 h-[2px] mx-auto m-4 bg-muted"></div>
                <div className="text-sm p-2">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Alias eos sint architecto recusandae! Hic, vero molestiae
                  voluptates neque nihil dolore, similique praesentium in
                  repudiandae dolores libero reprehenderit at soluta rem, amet
                  quis repellendus. Ipsa ullam autem qui, natus provident fugit
                  totam saepe distinctio ipsam, deserunt unde ipsum sit error
                  magni, deleniti blanditiis incidunt. Commodi sunt deleniti
                  libero quisquam eos quos ratione debitis quis, dolores minus
                  pariatur fugit obcaecati perspiciatis asperiores similique?
                  Accusantium eius beatae, cumque natus sit at officia
                  laboriosam nesciunt quisquam possimus veritatis voluptate quis
                  cupiditate ab maiores repudiandae magni dolor, ut fugit
                  ratione quo obcaecati. Sunt dolores fuga itaque placeat ullam
                  error exercitationem dolorum, esse expedita, soluta, animi
                  rerum! Impedit nam error, natus maiores libero qui. Quaerat
                  vero voluptatibus debitis ullam?
                </div>
                <div className="w-full h-[2px] m-2 bg-muted"></div>
                <div className="flex items-center justify-around gap-2 m-3">
                  <div className="flex hover:bg-muted cursor-pointer p-2 items-center gap-3">
                    <ThumbsUpIcon className="w-5 h-5" />
                    <div className="text-sm">0</div>
                  </div>
                  <div className="flex hover:bg-muted cursor-pointer p-2  items-center gap-3">
                    <MessageSquare className="w-5 h-5" />
                    <div className="text-sm">0</div>
                  </div>
                  <div className="flex hover:bg-muted cursor-pointer p-2  items-center gap-3">
                    <Repeat2 className="w-5 h-5" />
                    <div className="text-sm">0</div>
                  </div>
                </div>
                <div className="w-full h-[2px] bg-muted"></div>
              </div>
              <div className="postcard m-10 mt-3">
                <div className="flex header items-center gap-2">
                  <div className="flex gap-2 items-center">
                    <div>
                      <img
                        src={user.profilePicture}
                        className="w-10 h-10 rounded-full"
                        alt=""
                      />
                    </div>
                    <div className="flex-col">
                      <div className="pl-1 font-semibold">three</div>
                      <div className="text-muted-foreground text-sm flex gap-1 items-center">
                        <Globe className="w-4 h-4" />
                        <div>1d ago</div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto pr-10">
                    <EllipsisVertical className="h-8 cursor-pointer hover:bg-muted" />
                  </div>
                </div>
                <div className="w-3/4 h-[2px] mx-auto m-4 bg-muted"></div>
                <div className="text-sm p-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Similique optio dolorum modi incidunt nobis rerum vero,
                  mollitia nesciunt necessitatibus fugiat distinctio numquam,
                  voluptatum veniam eius, quaerat doloremque aut! Laborum
                  suscipit aspernatur libero possimus aliquid eum id nihil
                  explicabo, tenetur harum, mollitia sapiente laudantium placeat
                  quo? Vitae pariatur, error quibusdam officia ratione rerum
                  quae illo repellendus praesentium hic? Illum esse tempore
                  dolor nesciunt odit. Odit qui eveniet sequi. Quam ducimus
                  reiciendis quisquam nostrum tempora itaque, quidem, illo
                  voluptatem impedit iusto temporibus saepe inventore excepturi
                  accusamus optio, est quod? Possimus praesentium laborum sed
                  porro, similique consequuntur nulla dolore voluptatum sit illo
                  debitis beatae eum ducimus pemolestiae. Officia modi beatae
                  repellendus nihil perspiciatis vero dicta, explicabo corrupti?
                  Et, in eligendi aperiam beatae praesentium a, ab fuga
                  veritatis error optio odit aspernatur debitis? Labore vero
                  impedit odio sed minima officiis perspiciatis itaque aliquam,
                  ullam vitae deleniti ducimus!
                </div>
                <div className="w-full h-[2px] m-2 bg-muted"></div>
                <div className="flex items-center justify-around gap-2 m-3">
                  <div className="flex hover:bg-muted cursor-pointer p-2 items-center gap-3">
                    <ThumbsUpIcon className="w-5 h-5" />
                    <div className="text-sm">0</div>
                  </div>
                  <div className="flex hover:bg-muted cursor-pointer p-2  items-center gap-3">
                    <MessageSquare className="w-5 h-5" />
                    <div className="text-sm">0</div>
                  </div>
                  <div className="flex hover:bg-muted cursor-pointer p-2  items-center gap-3">
                    <Repeat2 className="w-5 h-5" />
                    <div className="text-sm">0</div>
                  </div>
                </div>
                <div className="w-full h-[2px] bg-muted"></div>
              </div>
              <div className="postcard m-10 mt-3">
                <div className="flex header items-center gap-2">
                  <div className="flex gap-2 items-center">
                    <div>
                      <img
                        src={user.profilePicture}
                        className="w-10 h-10 rounded-full"
                        alt=""
                      />
                    </div>
                    <div className="flex-col">
                      <div className="pl-1 font-semibold">three</div>
                      <div className="text-muted-foreground text-sm gap-1 flex items-center">
                        <Globe className="w-4 h-4" />
                        <div>1d ago</div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto pr-10">
                    <EllipsisVertical className="h-8 cursor-pointer hover:bg-muted" />
                  </div>
                </div>
                <div className="w-3/4 h-[2px] mx-auto m-4 bg-muted"></div>
                <div className="text-sm p-2">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Alias eos sint architecto recusandae! Hic, vero molestiae
                  voluptates neque nihil dolore, similique praesentium in
                  repudiandae dolores libero reprehenderit at soluta rem, amet
                  quis repellendus. Ipsa ullam autem qui, natus provident fugit
                  totam saepe distinctio ipsam, deserunt unde ipsum sit error
                  magni, deleniti blanditiis incidunt. Commodi sunt deleniti
                  libero quisquam eos quos ratione debitis quis, dolores minus
                  pariatur fugit obcaecati perspiciatis asperiores similique?
                  Accusantium eius beatae, cumque natus sit at officia
                  laboriosam nesciunt quisquam possimus veritatis voluptate quis
                  cupiditate ab maiores repudiandae magni dolor, ut fugit
                  ratione quo obcaecati. Sunt dolores fuga itaque placeat ullam
                  error exercitationem dolorum, esse expedita, soluta, animi
                  rerum! Impedit nam error, natus maiores libero qui. Quaerat
                  vero voluptatibus debitis ullam?
                </div>
                <div className="w-full h-[2px] m-2 bg-muted"></div>
                <div className="flex items-center justify-around gap-2 m-3">
                  <div className="flex hover:bg-muted cursor-pointer p-2 items-center gap-3">
                    <ThumbsUpIcon className="w-5 h-5" />
                    <div className="text-sm">0</div>
                  </div>
                  <div className="flex hover:bg-muted cursor-pointer p-2  items-center gap-3">
                    <MessageSquare className="w-5 h-5" />
                    <div className="text-sm">0</div>
                  </div>
                  <div className="flex hover:bg-muted cursor-pointer p-2  items-center gap-3">
                    <Repeat2 className="w-5 h-5" />
                    <div className="text-sm">0</div>
                  </div>
                </div>
                <div className="w-full h-[2px] bg-muted"></div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block w-1/3 h-screen">
            <div className="text-xl font-semibold m-5 ml-2">Accounts to follow</div>

            <div className="relative flex border-y-[1px] flex-col h-[40%] overflow-auto">
            <div className="absolute top-0 left-0 right-0 h-[60px] bg-gradient-to-b from-slate-800 to-transparent"></div>
              <div className="accountCard flex items-center justify-between gap-1 p-3 h-14 w-[95%] mx-auto border-y-2">
                <div className="flex items-center gap-1">
                    <div>
                      <img src={user.profilePicture} className="w-10 h-10 rounded-full " alt="" />
                    </div>
                    <div className="font-semibold">
                      Vignesh
                    </div>
                </div>
                    <FollowButton className="h-3/4"/>
              </div>
              <div className="accountCard flex items-center justify-between gap-1 p-3 h-14 w-[95%] mx-auto border-y-2">
                <div className="flex items-center gap-1">
                    <div>
                      <img src={user.profilePicture} className="w-10 h-10 rounded-full " alt="" />
                    </div>
                    <div className="font-semibold">
                      Vignesh
                    </div>
                </div>
                    <FollowButton className="h-3/4"/>
              </div>
              <div className="accountCard flex items-center justify-between gap-1 p-3 h-14 w-[95%] mx-auto border-y-2">
                <div className="flex items-center gap-1">
                    <div>
                      <img src={user.profilePicture} className="w-10 h-10 rounded-full " alt="" />
                    </div>
                    <div className="font-semibold">
                      Vignesh
                    </div>
                </div>
                    <FollowButton className="h-3/4"/>
              </div>
              <div className="accountCard flex items-center justify-between gap-1 p-3 h-14 w-[95%] mx-auto border-y-2">
                <div className="flex items-center gap-1">
                    <div>
                      <img src={user.profilePicture} className="w-10 h-10 rounded-full " alt="" />
                    </div>
                    <div className="font-semibold">
                      Vignesh
                    </div>
                </div>
                    <FollowButton className="h-3/4"/>
              </div>
              <div className="accountCard flex items-center justify-between gap-1 p-3 h-14 w-[95%] mx-auto border-y-2">
                <div className="flex items-center gap-1">
                    <div>
                      <img src={user.profilePicture} className="w-10 h-10 rounded-full " alt="" />
                    </div>
                    <div className="font-semibold">
                      Vignesh
                    </div>
                </div>
                    <FollowButton className="h-3/4"/>
              </div>
              <div className="accountCard flex items-center justify-between gap-1 p-3 h-14 w-[95%] mx-auto border-y-2">
                <div className="flex items-center gap-1">
                    <div>
                      <img src={user.profilePicture} className="w-10 h-10 rounded-full " alt="" />
                    </div>
                    <div className="font-semibold">
                      Vignesh
                    </div>
                </div>
                    <FollowButton className="h-3/4"/>
              </div>
              

              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

//TODO: const PostNavbar = ({controls}:any)=>{
//   return(
//     <motion.div
//     variants={{
//       hidden:{opacity:0},
//       visible:{opacity:1}
//     }}
//     initial="hidden"
//     animate={controls}
//       className="sticky flex flex-col top-0 w-full bg-white/30  backdrop-blur-3xl"
//     >
//       <div>three</div>
//       <div>3 posts</div>
//     </motion.div>
//   )
// }

export default Profile;
