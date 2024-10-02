import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

const StudentAuth = () => {
  return (
    <section className="flex items-center justify-center h-screen text-white w-full md:w-auto px-[10px]">
      <div className="flex justify-center flex-col bg-secondary rounded w-full md:w-auto">
        <div className="flex flex-col items-center justify-center px-[10px]  md:px-[48px] py-[54px]">
          <h1 className="text-[40px] mb-[24px]">L-Learn</h1>
          {/* <h2 className="text-[24px] mb-[16px]">Sign in</h2> */}
          {/* <div>
            <label className="block">Email:</label>
            <input
              type="email"
              placeholder="john@example.com"
              className="text-black w-[400px] py-3 px-4 rounded focus:border-[#6069D2]"
            />
          </div>
          <div>
            <label className="block">Password:</label>
            <input
              type="password"
              placeholder="********"
              className="text-black w-[400px] py-3 px-4 rounded focus:border-[#6069D2]"
            />
          </div> */}
          <button className="mb-4 bg-primary text-white w-full md:w-[400px] py-3 px-4 rounded focus:border-[#6069D2] hover:bg-primary_hover">
            <LoginLink>Sign in</LoginLink>
          </button>

          <div className="flex justify-center items-center w-full my-2">
            <hr className="h-[2px] w-full border border-[#AFAFAF]" />
            <span className="mx-8 text-[#AFAFAF]">or</span>
            <hr className="h-[2px] w-full border border-[#AFAFAF]" />
          </div>

          <div className="mt-[14px]">
            <p className="text-[12px]">
              Dont have account?{" "}
              <button className="bg-secondary text-white py-3 px-4 rounded focus:border-[#6069D2] hover:bg-primary_hover">
                <RegisterLink className="underline">Sign up</RegisterLink>
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default StudentAuth;
