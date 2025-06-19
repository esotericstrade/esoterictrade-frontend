import { Bell, CalendarDots, MagnifyingGlass } from "@phosphor-icons/react";
import { Input } from "antd";
import { Header as AntdHeader } from "antd/es/layout/layout";
import dayjs from "dayjs";

const Header = () => {
  return (
    <AntdHeader className="flex flex-row justify-between items-center  h-[70px] bg-white col-span-2 p-0 px-5">
      <div className="flex items-center gap-8">
        <img
          src="/logo.svg"
          width={200}
          height={64}
          alt="Logo"
          className="w-[120px] h-[40px]"
        />
        <Input
          placeholder="Search..."
          allowClear
          className="w-[300px] h-[45px] rounded-2xl bg-[#f5f6f8] border-none"
          prefix={<MagnifyingGlass size={20} className="text-gray-800" />}
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative overflow-hidden p-1 rounded-2xl bg-white">
          <Bell weight="fill" size={24} className="text-gray-800" />
        </div>
        <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-4 py-3 rounded-2xl bg-[#f5f6f8]">
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5">
            <CalendarDots size={24} className="text-gray-800" />
            <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-neutral-700">
              {dayjs().format("MMMM D, YYYY")}
            </p>
          </div>
        </div>
        <div className="flex-grow-0 flex-shrink-0 h-[45px]">
          <div className="flex justify-start items-start  h-[45px] overflow-hidden rounded-2xl bg-gray-50">
            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 h-[45px] w-[47px] gap-[5.785562515258789px] p-[5.785562515258789px] bg-[#f5f6f8]">
              <div
                className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[34px] h-[33px] relative gap-[5.785562515258789px] px-[5.785562515258789px] py-[4.339171886444092px] rounded-xl bg-white"
                style={{
                  boxShadow:
                    "0px 1.4463906288146973px 2.8927812576293945px 0 rgba(5,12,38,0.1)",
                }}
              >
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-[17.36px] h-[17.36px] relative"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M12.4009 9.28492C12.4009 11.282 10.782 12.9009 8.78492 12.9009C6.78787 12.9009 5.16895 11.282 5.16895 9.28492C5.16895 7.28787 6.78787 5.66895 8.78492 5.66895C10.782 5.66895 12.4009 7.28787 12.4009 9.28492Z"
                    fill="#262E3D"
                  />
                  <path
                    d="M8.06149 2.77593C8.06149 2.37652 8.38528 2.05273 8.78469 2.05273C9.1841 2.05273 9.50788 2.37652 9.50788 2.77593V3.49913C9.50788 3.89853 9.1841 4.22232 8.78469 4.22232C8.38528 4.22232 8.06149 3.89853 8.06149 3.49913V2.77593Z"
                    fill="#262E3D"
                  />
                  <path
                    d="M4.18228 5.70549C4.4647 5.98792 4.9226 5.98792 5.20503 5.70549C5.48745 5.42307 5.48745 4.96516 5.20503 4.68274L4.69365 4.17136C4.41123 3.88894 3.95332 3.88894 3.6709 4.17136C3.38847 4.45379 3.38847 4.91169 3.6709 5.19411L4.18228 5.70549Z"
                    fill="#262E3D"
                  />
                  <path
                    d="M13.8985 4.17153C13.6161 3.8891 13.1582 3.8891 12.8757 4.17153L12.3644 4.6829C12.0819 4.96533 12.0819 5.42323 12.3644 5.70565C12.6468 5.98808 13.1047 5.98808 13.3871 5.70565L13.8985 5.19428C14.1809 4.91185 14.1809 4.45395 13.8985 4.17153Z"
                    fill="#262E3D"
                  />
                  <path
                    d="M5.20514 12.864C4.92271 12.5816 4.46481 12.5816 4.18238 12.864L3.67101 13.3754C3.38858 13.6578 3.38858 14.1157 3.67101 14.3981C3.95343 14.6805 4.41134 14.6805 4.69376 14.3981L5.20514 13.8867C5.48756 13.6043 5.48756 13.1464 5.20514 12.864Z"
                    fill="#262E3D"
                  />
                  <path
                    d="M13.8984 14.398C13.616 14.6804 13.1581 14.6804 12.8756 14.398L12.3643 13.8866C12.0818 13.6042 12.0818 13.1463 12.3643 12.8638C12.6467 12.5814 13.1046 12.5814 13.387 12.8638L13.8984 13.3752C14.1808 13.6576 14.1808 14.1155 13.8984 14.398Z"
                    fill="#262E3D"
                  />
                  <path
                    d="M8.78469 14.3471C8.38528 14.3471 8.06149 14.6708 8.06149 15.0702V15.7934C8.06149 16.1929 8.38528 16.5166 8.78469 16.5166C9.1841 16.5166 9.50788 16.1929 9.50788 15.7934V15.0702C9.50788 14.6708 9.1841 14.3471 8.78469 14.3471Z"
                    fill="#262E3D"
                  />
                  <path
                    d="M15.2934 8.56149C15.6929 8.56149 16.0166 8.88528 16.0166 9.28469C16.0166 9.6841 15.6929 10.0079 15.2934 10.0079H14.5702C14.1708 10.0079 13.8471 9.6841 13.8471 9.28469C13.8471 8.88528 14.1708 8.56149 14.5702 8.56149H15.2934Z"
                    fill="#262E3D"
                  />
                  <path
                    d="M3.72232 9.28469C3.72232 8.88528 3.39853 8.56149 2.99912 8.56149H2.27593C1.87652 8.56149 1.55273 8.88528 1.55273 9.28469C1.55273 9.6841 1.87652 10.0079 2.27593 10.0079H2.99912C3.39853 10.0079 3.72232 9.6841 3.72232 9.28469Z"
                    fill="#262E3D"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 h-[45px] w-[35px] gap-[5.785562515258789px] p-[5.785562515258789px] bg-[#f5f6f8]">
              <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[22px] h-[33px] relative gap-[5.785562515258789px] px-[5.785562515258789px] py-[4.339171886444092px]">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-[17.36px] h-[17.36px] relative"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M8.84574 3.31836C5.51691 3.31836 2.81836 5.98959 2.81836 9.28472C2.81836 12.5799 5.51691 15.2511 8.84574 15.2511C10.7386 15.2511 12.4279 14.3867 13.5319 13.0372C13.6782 12.8585 13.7076 12.6125 13.6076 12.405C13.5076 12.1974 13.296 12.0652 13.0637 12.0651C10.4012 12.0645 8.243 9.92773 8.243 7.29202C8.243 6.1541 8.64452 5.11062 9.31549 4.29049C9.4617 4.11178 9.49114 3.86579 9.39115 3.65821C9.29117 3.45063 9.07956 3.31842 8.84724 3.31836H8.84574Z"
                    fill="#737373"
                  />
                  <path
                    d="M10.4803 6.15064C10.8173 6.15064 11.0905 5.88082 11.0905 5.54798C11.0905 5.21513 10.8173 4.94531 10.4803 4.94531C10.1433 4.94531 9.87012 5.21513 9.87012 5.54798C9.87012 5.88082 10.1433 6.15064 10.4803 6.15064Z"
                    fill="#737373"
                  />
                  <path
                    d="M13.5313 9.76661C13.5313 10.0995 13.2581 10.3693 12.9211 10.3693C12.5841 10.3693 12.3109 10.0995 12.3109 9.76661V9.16395H11.7007C11.3637 9.16395 11.0905 8.89413 11.0905 8.56129C11.0905 8.22845 11.3637 7.95863 11.7007 7.95863H12.3109V7.35596C12.3109 7.02312 12.5841 6.7533 12.9211 6.7533C13.2581 6.7533 13.5313 7.02312 13.5313 7.35596V7.95863H14.1415C14.4785 7.95863 14.7517 8.22845 14.7517 8.56129C14.7517 8.89413 14.4785 9.16395 14.1415 9.16395H13.5313V9.76661Z"
                    fill="#737373"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AntdHeader>
  );
};

export default Header;
