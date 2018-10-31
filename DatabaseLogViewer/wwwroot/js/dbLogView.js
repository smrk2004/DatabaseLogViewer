
var dbLogViewNamespace = function () {

    var logsTableDiv = $('#logsData');
    var logsRecords = $('.logRecord');
    var logsSpinnerDiv = $('#logsSpinnerContainer');

    var logsNavigatorStart= $('#logRecordNavigatorStart');
    var logsNavigatorEnd  = $('#logRecordNavigatorEnd');

    var logsNavigatorPageNumberCurrent= $('#logPageNumberCurrent');
    var logsNavigatorPageNumberTotal  = $('#logPageNumberTotal');

    var logsFirstPage = $('#logFirstPage');
    var logsLastPage  = $('#logLastPage');

    var logsPreviousPage = $('#logPreviousPage');
    var logsNextPage     = $('#logNextPage');

    var logsClear = $('#logClear');
    var logsBtns = $('.logsBtn');

    var headerRowDiv = $('#dbLogViewTableHeaderRow');
    var headerDivs = $('.hdr');
    var selectedHeaderDiv = $('.hdr.selected');
    var previousSortHeader = "DatabaseLogID";

    var pageSizeSel = $("#pageSize");


    var logsOptions = {

        perPageRecordCount: +15,
        autoUpdateFrequency: 60 * 1000, // update counts & re-render every 60 secs
    };

    var viewModel = {

        logsCount: +0,
        resultsPageCount: +1,
        currentPageNumber: +1,
        resultsJustCleared: false,

        /* Other implicit properties ->

            logs: array of logs,        // automatically populated by ajax call to server and used to render results view
            lastPageLogsCount: int,     // automatically set and used to determine last page end records counter
        */
    };

    var DEBUG = false;

    function clearResults() {

        $('.logRecord').remove();

        $(logsNavigatorStart).val(+0);
        $(logsNavigatorEnd).val(+0);

        $(logsNavigatorPageNumberCurrent).val(viewModel.currentPageNumber);
        $(logsNavigatorPageNumberTotal).val(viewModel.resultsPageCount);

        viewModel.resultsJustCleared = true;
    }
    function setLoadingState() {

        $(logsSpinnerDiv).removeClass('hiddenNone');
        $(logsTableDiv).addClass('hiddenNone');
        $(logsBtns).attr('disabled', 'disabled');
    }
    function exitLoadingState() {

        $(logsSpinnerDiv).addClass('hiddenNone');
        $(logsTableDiv).removeClass('hiddenNone');
        $(logsBtns).removeAttr('disabled');
    }

    function setupEventListeners() {

        /* listeners for page navigation */
        $(logsFirstPage).on('click', function () {

            viewModel.currentPageNumber = 1;
            updateLogs();
        });
        $(logsLastPage).on('click', function () {

            viewModel.currentPageNumber = viewModel.resultsPageCount;
            updateLogs();
        });

        $(logsPreviousPage).on('click', function () {

            if (viewModel.currentPageNumber !== 1) {

                viewModel.currentPageNumber = viewModel.currentPageNumber - 1;
                updateLogs();
            }
            else {
                if (viewModel.resultsJustCleared) { updateLogs(); }
                else {
                    alert("Can\'t go to Previous page. Already at First page.");
                    DEBUG && console.debug("Can\'t go to Previous page. Already at First page.");
                }
            }
        });
        $(logsNextPage).on('click', function () {

            if (viewModel.currentPageNumber !== viewModel.resultsPageCount) {

                viewModel.currentPageNumber = viewModel.currentPageNumber + 1;
                updateLogs();
            }
            else {
                if (viewModel.resultsJustCleared) { updateLogs(); }
                else {
                    alert("Can\'t go to Next page. Already at Last page.")
                    DEBUG && console.debug("Can\'t go to Next page. Already at Last page.");
                }
            }
        });

        $(logsClear).on('click', function () { clearResults(); });


        /* listener for sorting */
        $(headerDivs).on('click', function () {

            $(headerDivs).removeClass('selected');
            $(this).addClass('selected');

            var _selectedHeaderSel = $('.hdr.selected');;
            var _sortHeader = _selectedHeaderSel && $(_selectedHeaderSel[0]).text().trim();

            if (_sortHeader == previousSortHeader) {
                if (headerRowDiv.hasClass('ascending')) {
                    headerRowDiv.removeClass('ascending')
                }
                else {
                    headerRowDiv.addClass('ascending');
                }
            }

            previousSortHeader = _sortHeader;
            updateLogs();
        });


        /* listener for page-size */
        $(pageSizeSel).on('keyup', function () {

            var value = $(this).val();

            if (value == parseInt(value, 10)) {

                if (value > 0) { // check for allowed numeric range

                    if (value == logsOptions.perPageRecordCount) {

                        return; // do nothing if page size unchanged!
                    }

                    logsOptions.perPageRecordCount = +value;

                    computePageMath();
                    checkAndHandleCurrentPageExceedsTotalPages();

                    updateLogs();
                }
                else {

                    $(this).val(logsOptions.perPageRecordCount); // reset to previous value if <=0
                }
            }
            else {

                $(this).val(logsOptions.perPageRecordCount); // reset to previous value if not number
            }
        });
    }

    function computePageMath() {

        if (viewModel.logsCount != 0) { // computePageMath ONLY if logs exist
        
            viewModel.resultsPageCount = viewModel.logsCount / logsOptions.perPageRecordCount;
            viewModel.lastPageLogsCount = viewModel.logsCount % logsOptions.perPageRecordCount;

            if (viewModel.lastPageLogsCount > 0.0) {

                viewModel.resultsPageCount = Math.ceil(viewModel.resultsPageCount); // if remainder returned, there's small number of records that can fit into one more page!
            }

            // update lastPageLogsCount - for case when: records-count = exact multiple of pageSize
            if(viewModel.lastPageLogsCount == 0) {

                viewModel.lastPageLogsCount = +logsOptions.perPageRecordCount;
            }
        }
    }
    function checkAndHandleCurrentPageExceedsTotalPages() {

        // if current page number exceeds legal range, post changing 'records-per-page'; set to the 'new' last page
        if (viewModel.currentPageNumber > viewModel.resultsPageCount) {
            viewModel.currentPageNumber = +viewModel.resultsPageCount
        }
    }
    function checkAndSetNavigation() {

        var _currentPageNumber = viewModel.currentPageNumber;    // load last loaded page; this will be the first page when we run it first time ever

        checkAndHandleCurrentPageExceedsTotalPages();

        /* Compute Start & End Record indices + set to UI; also update current & total page numbers to UI */

        var endPageNumber = viewModel.resultsPageCount;

        var startIndex = (_currentPageNumber - 1) * logsOptions.perPageRecordCount;
        var endIndexPlus1 = +startIndex + ((_currentPageNumber !== endPageNumber) ? (+logsOptions.perPageRecordCount) : (+viewModel.lastPageLogsCount));    // last page has potentialy less values than page capacity!

        $(logsNavigatorStart).val(startIndex + 1);
        $(logsNavigatorEnd).val(endIndexPlus1);

        $(logsNavigatorPageNumberCurrent).val(_currentPageNumber);
        $(logsNavigatorPageNumberTotal).val(endPageNumber);
    }

    function getLogsListTable(logRecord) {
        
        var newRow = '<tr id="' + logRecord.databaseLogID + '" class="logRecord">' +

                        '<td class="dbLogID"   title="' + logRecord.databaseLogID + '">' + logRecord.databaseLogID   + '</td>' +
                        '<td class="dbUser"    title="' + logRecord.databaseUser  + '">' + logRecord.databaseUser    + '</td>' +
                        '<td class="dbEvent"   title="' + logRecord.event         + '">' + logRecord.event           + '</td>' +
                        '<td class="dbSchema"  title="' + logRecord.schema        + '">' + logRecord.schema          + '</td>' +
                        '<td class="dbObject"  title="' + logRecord.object        + '">' + logRecord.object          + '</td>' +
                        '<td class="dbTSQL"    title="' + logRecord.tsql          + '"><textarea class="tsqlTextArea" rows="2" cols="40" id="text" wrap="hard">' + logRecord.tsql + '</textarea></td>' +

                        '<span class="spanClear"/>' +

                     '</tr>';
        return newRow;
    }
    function loadLogsToUI() { // Load this data to UI / Populate the Logs table

        clearResults();
        checkAndSetNavigation();

        /* Load Page to UI display */

        for (var i = 0; i < logsOptions.perPageRecordCount; i++) {

            var log = viewModel.logs && viewModel.logs[i];
            if (typeof log !== "undefined" &&
                       log !== null) {

                var logRow = getLogsListTable(log);

                    $(logsTableDiv).append(logRow);
            }
            else {

                DEBUG && console.debug('Skipped Invalid Log record[ PageNumber='+currentPageNumber+', RecordIndex=' + i + ' ]')
            }
        }

        viewModel.resultsJustCleared = false;
    }

    function updateLogs() {

        DEBUG && console.debug("@ updateLogs()");

        var _selectedHeaderSel = $('.hdr.selected');

        var sortField       = _selectedHeaderSel && ('[' + $(_selectedHeaderSel[0]).text().trim() + ']'); // eg: [Schema] is a special field; so adding [] to all to be safe
        var sortDirection   = headerRowDiv.hasClass('ascending') ? 'ASC' : 'DESC';
        var pageNumber      = viewModel.currentPageNumber;
        var pageSize        = logsOptions.perPageRecordCount;

        var startTime = new Date();

            setLoadingState();

        $.ajax({

            url: GetLogsEndpoint,
            type: 'GET',

            data: {
                sortField: sortField,
                sortDirection: sortDirection,
                pageNumber: pageNumber,
                pageSize: pageSize
            },

            cache: false,

            success: function (ajaxd_logsResultsData) {

                DEBUG && console.log("Success fetching Logs Results");
                DEBUG && console.log(ajaxd_logsResultsData); // expected type is array of 'Log' - in json object-form

                /* Update 'Logs Results' data to View Model */

                    viewModel.logs = ajaxd_logsResultsData;
                    loadLogsToUI();

                DEBUG && console.log("Success fetching + ViewModel loading Logs Results");
            },

            error: function (req, status, error) {

                DEBUG && console.log("Error while loading Logs Results");

                DEBUG && console.log("REQUEST:");
                DEBUG && console.log(req);
                DEBUG && console.log("STATUS:" + status);
                DEBUG && console.log("ERROR:" + error);

                alert("An error while loading Logs Results:\n\n" + JSON.parse(req.responseText));
            },

            complete: function () {

                exitLoadingState();

                var endTime = new Date();
                var elapsedTimeSecs = (endTime - startTime) / 1000;

                DEBUG && console.debug("@updateLogs() - complete: Elapsed Time = " + elapsedTimeSecs + " seconds");
            }
        });
    }
    function updateLogsCount() {

        DEBUG && console.debug("@ updateLogsCount()");

        var startTime = new Date();

            setLoadingState();

        $.ajax({

            url: GetLogsCountEndpoint,
            type: 'GET',

            cache: false,

            success: function (ajaxd_logCountResultData) {

                DEBUG && console.log("Success fetching Log Count Results");
                DEBUG && console.log(ajaxd_logCountResultData);

                /* Update 'Log Counts' data to View Model */

                viewModel.logsCount = ajaxd_logCountResultData;

                computePageMath();
                checkAndSetNavigation();

                DEBUG && console.log("Success fetching + ViewModel loading Log Count Results");
            },

            error: function (req, status, error) {

                DEBUG && console.log("Error while loading Log Count Results");

                DEBUG && console.log("REQUEST:");
                DEBUG && console.log(req);
                DEBUG && console.log("STATUS:" + status);
                DEBUG && console.log("ERROR:" + error);

                alert("An error while loading Log Count Results:\n\n" + JSON.parse(req.responseText));
            },

            complete: function () {

                exitLoadingState();

                var endTime = new Date();
                var elapsedTimeSecs = (endTime - startTime) / 1000;

                DEBUG && console.debug("@updateLogsCount() - complete: Elapsed Time = " + elapsedTimeSecs + " seconds");
            }
        });
    }
    function updateLogsAndCount() {

        updateLogsCount();
        updateLogs();
    }

    function init() {
        
        setupEventListeners();

        updateLogsAndCount();
        setInterval(updateLogsAndCount, logsOptions.autoUpdateFrequency); // setup auto update!
    }

    return {
        init: init
    };
}

$(document).ready(function () {

    var dbLogView = new dbLogViewNamespace();

        dbLogView.init();
});
