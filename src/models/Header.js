/**
 * Created by maxime on 12/04/17.
 */

import Types from './Types';

export const Header = {
    'gbc-header': {
        'type': Types.optional,
        'value': false,
        'title': 'Header',
        'contain': {
            'gbc-header-height': {
                'type': Types.size,
                'default': '0px',
                'value': undefined
            },
            'gbc-header-background-color': {
                'type': Types.color,
                'default': 'white',
                'value': undefined
            },
            'gbc-header-logo': {
                'type': Types.optional,
                'value': false,
                'title': 'Logo',
                'contain': {
                    'gbc-header-logo-file': {
                        'type': Types.img,
                        'default': 'none',
                        'value': undefined
                    },
                    'gbc-header-logo-position': {
                        'type': Types.position,
                        'default': 'left',
                        'value': undefined
                    },
                    'gbc-header-logo-size': {
                        'type': Types.size,
                        'default': '0px',
                        'value': undefined
                    }
                }
            },
            'gbc-header-text-primary': {
                'type': Types.optional,
                'value': false,
                'title': 'Primary text',
                'contain': {
                    'gbc-header-text--primary': {
                        'type': Types.string,
                        'default': "Insert text",
                        'value': ""
                    },
                    'gbc-header-text-position--primary': {
                        'type': Types.position,
                        'default': 'left',
                        'value': undefined
                    },
                    'gbc-header-font-color--primary': {
                        'type': Types.color,
                        'default': 'black',
                        'value': undefined
                    },
                    'gbc-header-text-decoration--primary': {
                        'type': Types.textDecoration,
                        'default': 'none',
                        'value': undefined
                    },
                    'gbc-header-text-hyperlink--primary': {
                        'type': Types.optional,
                        'value': false,
                        'title': 'HyperLink',
                        'contain': {
                            'gbc-header-text-hyperlink-url--primary': {
                                'type': Types.string,
                                'default': '',
                                'value': undefined
                            }
                        }
                    }
                }
            },
            'gbc-header-text-secondary': {
                'type': Types.optional,
                'value': false,
                'title': 'Secondary Text',
                'contain': {
                    'gbc-header-text--secondary': {
                        'type': Types.string,
                        'default': "Insert text",
                        'value': ""
                    },
                    'gbc-header-text-position--secondary': {
                        'type': Types.position,
                        'default': 'left',
                        'value': undefined
                    },
                    'gbc-header-font-color--secondary': {
                        'type': Types.color,
                        'default': 'black',
                        'value': undefined
                    },
                    'gbc-header-text-decoration--secondary': {
                        'type': Types.textDecoration,
                        'default': 'none',
                        'value': undefined
                    },
                    'gbc-header-text-hyperlink--secondary': {
                        'type': Types.optional,
                        'value': false,
                        'title': 'HyperLink',
                        'contain': {
                            'gbc-header-text-hyperlink-url--secondary': {
                                'type': Types.string,
                                'default': '',
                                'value': undefined
                            }
                        }
                    }
                }
            }
        }
    }
};

export default Header;