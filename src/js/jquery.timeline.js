/*!
 * Timeline - jQuery Timeline Widget
 * @author Valerio Galano <v.galano@daredevel.com>
 * @license MIT
 * @see https://github.com/daredevel/jquery-timeline
 * @version 0.1
 */
(function ($, undefined) {
    $.widget("daredevel.timeline", {

        /**
         * Attach event in right position
         *
         * @param event
         * @param datetime
         * @private
         *
         * @todo improve code
         */
        _attachEvent:function (event, datetime) {

            var datetime = new Date(datetime);

            var prevEvent = this._findPrevEventByTimestamp(Date.parse(datetime));

            var splitContainer = this._findSplitContainer(datetime);

            if ((splitContainer == undefined) && (prevEvent == undefined)) {
                splitContainer = this._buildSplitContainer(datetime);
                splitContainer.append(event);
                this.element.prepend(splitContainer);
                return;
            }

            if ((splitContainer != undefined) && (prevEvent == undefined)) {
                splitContainer.find('.daredevel-timeline-split-title').after(event);
                return;
            }

            if ((splitContainer != undefined) && (prevEvent != undefined)) {
                prevEvent.after(event);
                return;
            }

            if ((splitContainer == undefined) && (prevEvent != undefined)) {
                splitContainer = this._buildSplitContainer(datetime);
                splitContainer.append(event);
                prevEvent.parent().after(splitContainer);
                return;
            }

        },

        /**
         * Build event element
         *
         * @param attributes
         * @return \jQuery|HTMLElement
         * @private
         */
        _buildEvent:function (attributes) {

            var event = $('<div/>', {
                'class': 'daredevel-timeline-event',
                'data-timestamp':Date.parse(attributes.datetime)
            });

            var title = $('<div/>', {
                'class': 'daredevel-timeline-event-title',
                'html': attributes.title
            });

            var content = $('<div/>', {
                'class': 'daredevel-timeline-event-content',
                'html': attributes.content
            });

            var datetime = $('<div/>', {
                'class': 'daredevel-timeline-event-datetime',
                'html': (attributes.datetimeToShow == undefined) ? attributes.datetime : attributes.datetimeToShow
            });

            return event.append(title).append(datetime).append(content);
        },

        _buildSplitContainer: function(datetime){
            var splitContainer = $('<div/>', {
                'class': 'daredevel-timeline-split',
                'data-year': datetime.getFullYear()
            });
            var splitTitle = $('<div/>', {
                'class': 'daredevel-timeline-split-title',
                'html':datetime.getFullYear()
            });

            splitContainer.append(splitTitle);

            return splitContainer;
        },

        /**
         * Initialize plugin.
         *
         * @private
         */
        _create:function () {

            var t = this;

            // add jQueryUI css widget classes
            this.element.addClass('ui-widget ui-widget-content daredevel-timeline');

            if (this.options.events != null) {
                $.each(this.options.events, function (key, value) {
                    t.addEvent(value);
                });
            }
        },

        /**
         * Destroy plugin
         *
         * @private
         *
         * @todo complete destroy method
         */
        _destroy:function () {
            $.Widget.prototype.destroy.call(this);
        },

        /**
         * Find haystack element just greater (or equal) than needle
         *
         * @param haystack ascendant list of numbers
         * @param needle number
         * @param minPos first position (initially must be 0)
         * @param maxPos last position (initially must be haystack.length-1)
         * @return undefined | integer
         * @private
         */
        _findPrev:function (haystack, needle, minPos, maxPos) {
            if (haystack.length < 1) {
                return undefined;
            }

            if (maxPos == minPos) {
                if (needle > haystack[minPos]) {
                    return undefined;
                } else {
                    return haystack[minPos];
                }
            }

            var pos = Math.floor(((maxPos + minPos) / 2));
            if (needle == haystack[pos]) {
                return haystack[pos];
            } else if (needle > haystack[pos]) {
                minPos = pos + 1;
            } else {
                maxPos = pos;
            }

            return this._findPrev(haystack, needle, minPos, maxPos);
        },

        /**
         * Fetch previous event in actual timeline
         *
         * @param timestamp
         * @return jQuery HTMLElement | undefined
         * @private
         */
        _findPrevEventByTimestamp:function (timestamp) {
            var timestampsList = [];
            $('[data-timestamp]').each(function () {
                timestampsList.push($(this).attr('data-timestamp'));
            });

            var prevTimestamp = this._findPrev(timestampsList.reverse(), timestamp, 0, timestampsList.length - 1);

            if (prevTimestamp == undefined) {
                return undefined;
            }

            return $('[data-timestamp="' + prevTimestamp + '"]');
        },

        _findSplitContainer:function (datetime) {
            var splitContainer = this.element.find('div[data-year="' + datetime.getFullYear() + '"]');
            if (splitContainer.length < 1) {
                return undefined;
            }

            return splitContainer;
        },

        /**
         * Add new event to timeline
         *
         * @public
         *
         * @param attributes
         */
        addEvent:function (attributes) {

            var event = this._buildEvent(attributes);

            this._attachEvent(event, attributes.datetime);

            this._trigger('add', true, event);
        },

        /**
         * Default options values.
         */
        options:{

            /**
             * Defines starting events to show in timeline
             */
            events:{ }
        }
    });

})(jQuery);
