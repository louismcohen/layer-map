import { useRef } from 'react';
import { motion } from 'motion/react';
import { useSearchFilterStore } from '../stores/searchFilterStore';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import ClearButton from './ClearButton';
import { useMapStore } from '../stores/mapStore';
import { use } from 'motion/react-client';
import { useSearchPlaces } from '../hooks/useSearchPlaces';
import { SearchFilter } from '../types/searchFilter';

const SearchButton = ({ searchTerm }: Pick<SearchFilter, 'searchTerm'>) => {
  const { refetch, isFetching } = useSearchPlaces(searchTerm);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      onClick={() => searchTerm !== '' && refetch()}
      className='w-fit h-[36px] flex flex-row items-center'
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        className={`w-[32px] h-[32px] flex justify-center items-center transition-all bg-neutral-400 rounded-full outline-none hover:outline-none hover:border-none focus:outline-none p-0 ${
          isFetching || searchTerm === ''
            ? 'disabled opacity-50 cursor-default'
            : ' hover:bg-neutral-500'
        }`}
      >
        <FaMagnifyingGlass size={16} color={'white'} />
      </motion.button>
    </motion.div>
  );
};

const SearchInput = () => {
  const searchBarRef = useRef<HTMLInputElement>(null);
  const {
    searchInputFocused,
    updateSearchInputFocused,
    searchTerm,
    updateSearchTerm,
  } = useSearchFilterStore();
  return (
    <div
      tabIndex={0}
      className={`w-full pointer-events-auto hover:outline-2 hover:outline-offset-0 hover:outline-cyan-500 bg-gray-50/85 backdrop-blur-sm transition-all duration-300 flex justify-center items-center px-3 gap-2 rounded-md overflow-hidden border border-neutral-500/10 outline ${
        searchInputFocused
          ? 'outline-2 outline-offset-0 outline-cyan-500 bg-gray-50/90 backdrop-blur-md shadow-md'
          : 'outline-none shadow-sm'
      }`}
      onClick={() => updateSearchInputFocused(true)}
    >
      <input
        ref={searchBarRef}
        type='text'
        placeholder='Search by name, note, or category'
        value={searchTerm}
        onChange={(e) => updateSearchTerm(e.target.value)}
        // onFocus={() => setSearchInputFocused(true)}
        // onBlur={(e) => {
        // 	console.log(e.relatedTarget);
        // 	if (e.relatedTarget === null) {
        // 		e.target.focus();
        // 		setSearchInputFocused(true);
        // 	} else {
        // 		setSearchInputFocused(false);
        // 	}
        // }}
        className='w-full h-[48px] bg-transparent outline-none md:text-lg text-md text-gray-900 text-ellipsis'
      />
      <SearchButton searchTerm={searchTerm} />
    </div>
  );
};

const Sidebar = () => {
  const { updateSearchInputFocused } = useSearchFilterStore();
  const { layers, toggleLayer } = useMapStore();

  return (
    <div className='absolute top-0 left-0 flex flex-col gap-2 justify-center items-center w-1/4 h-full p-4 pointer-events-none'>
      <div
        className='h-full w-full p-2 flex flex-col justify-start items-center pointer-events-none bg-gray-50/85 backdrop-blur-sm transition-all duration-300 rounded-lg overflow-hidden border border-neutral-500/10 outline-none shadow-lg'
        onClick={() => updateSearchInputFocused(false)}
      >
        <SearchInput />
        <ul className='w-full h-full p-2 flex flex-col gap-3 justify-start items-center overflow-y-auto  pointer-events-auto'>
          {layers.map((layer) => {
            return (
              <li
                className='w-full flex flex-row justify-start items-center gap-2 cursor-pointer'
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
              >
                <div
                  className='w-[16px] h-[16px] rounded-full'
                  style={{ backgroundColor: layer.color }}
                ></div>
                <p
                  className={`${
                    layer.visible ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {layer.name} ({layer.places.length})
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
