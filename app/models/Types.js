/**
 * Created by maxime on 11/04/17.
 */
const color_literal = [
    'AliceBlue',
    'AntiqueWhite',
    'Aqua',
    'Aquamarine',
    'Azure',
    'Beige',
    'Bisque',
    'Black',
    'BlanchedAlmond',
    'Blue',
    'BlueViolet',
    'Brown',
    'BurlyWood',
    'CadetBlue',
    'Chartreuse',
    'Chocolate',
    'Coral',
    'CornflowerBlue',
    'Cornsilk',
    'Crimson',
    'Cyan',
    'DarkBlue',
    'DarkCyan',
    'DarkGoldenRod',
    'DarkGray',
    'DarkGrey',
    'DarkGreen',
    'DarkKhaki',
    'DarkMagenta',
    'DarkOliveGreen',
    'DarkOrange',
    'DarkOrchid',
    'DarkRed',
    'DarkSalmon',
    'DarkSeaGreen',
    'DarkSlateBlue',
    'DarkSlateGray',
    'DarkSlateGrey',
    'DarkTurquoise',
    'DarkViolet',
    'DeepPink',
    'DeepSkyBlue',
    'DimGray',
    'DimGrey',
    'DodgerBlue',
    'FireBrick',
    'FloralWhite',
    'ForestGreen',
    'Fuchsia',
    'Gainsboro',
    'GhostWhite',
    'Gold',
    'GoldenRod',
    'Gray',
    'Grey',
    'Green',
    'GreenYellow',
    'HoneyDew',
    'HotPink',
    'IndianRed',
    'Indigo',
    'Ivory',
    'Khaki',
    'Lavender',
    'LavenderBlush',
    'LawnGreen',
    'LemonChiffon',
    'LightBlue',
    'LightCoral',
    'LightCyan',
    'LightGoldenRodYellow',
    'LightGray',
    'LightGrey',
    'LightGreen',
    'LightPink',
    'LightSalmon',
    'LightSeaGreen',
    'LightSkyBlue',
    'LightSlateGray',
    'LightSlateGrey',
    'LightSteelBlue',
    'LightYellow',
    'Lime',
    'LimeGreen',
    'Linen',
    'Magenta',
    'Maroon',
    'MediumAquaMarine',
    'MediumBlue',
    'MediumOrchid',
    'MediumPurple',
    'MediumSeaGreen',
    'MediumSlateBlue',
    'MediumSpringGreen',
    'MediumTurquoise',
    'MediumVioletRed',
    'MidnightBlue',
    'MintCream',
    'MistyRose',
    'Moccasin',
    'NavajoWhite',
    'Navy',
    'OldLace',
    'Olive',
    'OliveDrab',
    'Orange',
    'OrangeRed',
    'Orchid',
    'PaleGoldenRod',
    'PaleGreen',
    'PaleTurquoise',
    'PaleVioletRed',
    'PapayaWhip',
    'PeachPuff',
    'Peru',
    'Pink',
    'Plum',
    'PowderBlue',
    'Purple',
    'RebeccaPurple',
    'Red',
    'RosyBrown',
    'RoyalBlue',
    'SaddleBrown',
    'Salmon',
    'SandyBrown',
    'SeaGreen',
    'SeaShell',
    'Sienna',
    'Silver',
    'SkyBlue',
    'SlateBlue',
    'SlateGray',
    'SlateGrey',
    'Snow',
    'SpringGreen',
    'SteelBlue',
    'Tan',
    'Teal',
    'Thistle',
    'Tomato',
    'Turquoise',
    'Violet',
    'Wheat',
    'White',
    'WhiteSmoke',
    'Yellow',
    'YellowGreen'
];

const literal = () => color_literal.reduce((e,i) => e.toLowerCase().concat('|' + i.toLowerCase()));

export const Types = {
    'ratio': {
        'pattern': '-?[0-9]+(\.[0-9]+)?',
        'error': 'Input isn\'t a number',
        'proposition': ['0', '0.5', '2'],

    },
    'string': {
        'pattern': '.*',
        'error': '',
        'proposition': [],

    },
    'size': {
        'pattern': '(?:-?[0-9]+(\.[0-9]+)?)(?:(?:px)|(?:pc)|(?:vh)|(?:vw)|(?:em)|(?:rem)|(?:cm)|(?:%))?',
        'error': 'Input isn\'t an acceptable size',
        'proposition': ['pc', 'px', 'vh', 'vw', 'em', 'rem', 'cm', '%']
    },
    'color': {
        'pattern':  '(?:rgba[(][0-9]+,[0-9]+,[0-9]+,(?:[0-1]+(?:\.[0-9]+)|[0-1])[)])|' +
                    '(?:rgb[(][0-9]+,[0-9]+,[0-9]+[)])|' +
                    '(?:#(?:[a-fA-F0-9]{6}|[a-fA-F0-9]{3}))|' +
                    '(?:hsl[(][0-9]+,[0-9]+%,[0-9]+%[)])|' +
                    '(?:hsla[(][0-9]+,[0-9]+%,[0-9]+%,(?:[0-1]+(?:\.[0-9]+)|[0-1])[)])|' +
                    literal(),
        'error': 'Input isn\'t an acceptable color',
        'proposition': ['rgb(0,0,0)', 'rgba(0,0,0,0)', 'hsl(0,0,0)', 'hsla(0,0,0,0)', '#FFF', 'blue'],

    },
    'duration': {
        'pattern': '^[0-9]+(\.[0-9]+)?s$',
        'error': 'Input isn\'t an acceptable duration',
        'proposition': ['10s', '1s', '0.1s']
    },
    'boolean': {
        'pattern': 'true|false',
        'error': '',
        'proposition': []
    },
    'img': {
        'pattern': '.*(?:\.(?:png|jpeg|jpg|gif|svg|ico))$',
        'error': 'Input isn\'t an acceptable image',
        'proposition': ['.png', '.jpeg', '.jpg', '.gif', '.ico', '.svg']
    },
    'position': {
        'pattern': 'center|left|right',
        'error': 'Input isn\'t an acceptable position',
        'proposition': ['center', 'left', 'right']
    },
    'optional': {
        'pattern': 'on|off',
        'error': '',
        'proposition': []
    },
    'textDecoration': {
        'pattern': 'none|underline|overline|line-through',
        'error': 'Input isn\'t an acceptable pattern',
        'proposition': ['none', 'underline', 'overline', 'line-through']

    }
};

export default Types;