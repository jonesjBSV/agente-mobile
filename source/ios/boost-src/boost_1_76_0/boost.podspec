Pod::Spec.new do |spec|
  spec.name = 'boost'
  spec.version = '1.76.0'
  spec.license = { :type => 'Boost Software License', :file => "LICENSE_1_0.txt" } # Relative to this podspec
  spec.homepage = 'http://www.boost.org'
  spec.summary = 'Boost provides free peer-reviewed portable C++ source libraries.'
  spec.authors = 'Rene Rivera' # Or 'Boost Libraries'

  spec.source = { :path => '.' }

  spec.platforms = { :ios => '11.0', :tvos => '11.0' }
  spec.requires_arc = false

  spec.module_name = 'boost'
  spec.header_dir = 'boost'
  spec.source_files = 'boost/**/*.{h,hpp}' # Changed to include .hpp
  spec.header_mappings_dir = 'boost'
  spec.public_header_files = '**/*.{h,hpp}' # Relative to header_mappings_dir
  
  spec.compiler_flags   = '-Wno-shorten-64-to-32 -Wno-implicit-int-conversion -Wno-unneeded-internal-declaration'
  spec.pod_target_xcconfig = {
    'USE_HEADERMAP' => 'NO',
    'HEADER_SEARCH_PATHS' => '"$(PODS_TARGET_SRCROOT)"',
    'CLANG_CXX_LANGUAGE_STANDARD' => 'c++14',
  }
end
